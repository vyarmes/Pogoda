document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const btn = form.querySelector('.submit-btn');
  const captcha = document.getElementById('captcha');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Будь ласка, заповніть усі поля');
      return;
    }

    if (!captcha.checked) {
      alert('Будь ласка, підтвердіть, що ви не робот');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Завантаження...';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Вхід успішний!');
        const { token, user } = data;
        const session = { username: user.username, avatar: user.avatar || null, token, expiresAt: Date.now() + SESSION_TTL_MS };
        try { sessionStorage.setItem('pogoda_session', JSON.stringify(session)); } catch (e) {}
        try { localStorage.setItem('pogoda_username', user.username); } catch (e) {}
        window.location.href = '/index.html';
      } else {
        alert(data.error || 'Невідома помилка');
      }
    } catch (error) {
      alert('Помилка при відправленні: ' + error.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Увійти';
    }
  });
});

function touchSession(username) {
  const ttlMs = 30 * 60 * 1000;
  const item = { username, expiresAt: Date.now() + ttlMs };
  try { sessionStorage.setItem('pogoda_session', JSON.stringify(item)); } catch (e) {}
}
