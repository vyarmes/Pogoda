import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'users.json');
const SESSION_TTL_MS = 30 * 60 * 1000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const sessions = new Map();

function readUsers() {
  if (!existsSync(DB_PATH)) return [];
  try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return []; }
}

function writeUsers(users) {
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

function getSession(req) {
  const token = req.headers['x-session-token'];
  if (!token) return null;
  const s = sessions.get(token);
  if (!s || Date.now() > s.expiresAt) {
    sessions.delete(token);
    return null;
  }
  s.expiresAt = Date.now() + SESSION_TTL_MS;
  return s;
}

function requireSession(req, res, next) {
  const s = getSession(req);
  if (!s) return res.status(401).json({ success: false, error: 'Не авторизовано' });
  req.username = s.username;
  next();
}

function appendHistory(user, query) {
  if (!Array.isArray(user.history)) user.history = [];
  user.history = user.history.filter(h => h !== query);
  user.history.unshift(query);
  if (user.history.length > 20) user.history = user.history.slice(0, 20);
  return user.history;
}

app.post('/api/register', (req, res) => {
  const { username, email, password, avatar } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'Всі поля обов\'язкові' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Пароль має бути не менше 6 символів' });
  }
  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'Користувач з таким email вже існує' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, error: 'Користувач з таким ім\'ям вже існує' });
  }
  const newUser = { id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1, username, email, password, avatar: avatar || null, history: [] };
  users.push(newUser);
  writeUsers(users);
  res.json({ success: true });
});

app.get('/reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'reg.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Всі поля обов\'язкові' });
  }
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ success: false, error: 'Невірне ім\'я користувача або пароль' });
  }
  const token = Buffer.from(`${user.id}:${Date.now()}:${Math.random().toString(36).slice(2)}`).toString('base64url');
  sessions.set(token, { username: user.username, userId: user.id, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL_MS });
  res.json({ success: true, token, user: { username: user.username, email: user.email, avatar: user.avatar } });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers['x-session-token'];
  if (token) sessions.delete(token);
  res.json({ success: true });
});

app.get('/api/session', requireSession, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.username === req.username);
  if (!user) return res.status(404).json({ success: false, error: 'Користувача не знайдено' });
  res.json({ success: true, user: { username: user.username, email: user.email, avatar: user.avatar, history: user.history || [] } });
});

app.post('/api/history', requireSession, (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.json({ success: true, history: [] });
  const users = readUsers();
  const user = users.find(u => u.username === req.username);
  if (!user) return res.status(404).json({ success: false, error: 'Користувача не знайдено' });
  const history = appendHistory(user, query.trim());
  writeUsers(users);
  res.json({ success: true, history });
});

app.get('/api/avatars', (req, res) => {
  try {
    const files = readdirSync(path.join(__dirname, 'ava')).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
    res.json({ success: true, avatars: files });
  } catch (e) {
    res.json({ success: true, avatars: [] });
  }
});

app.listen(PORT, () => console.log(`Сервер запущено: http://localhost:${PORT}`));
