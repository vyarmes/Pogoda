'use strict';

/* ── Weather code maps ───────────────────────────────── */
const WC = {
  0:'Ясно',1:'Переважно ясно',2:'Частково хмарно',3:'Хмарно',
  45:'Туман',48:'Іній',
  51:'Легка мряка',53:'Помірна мряка',55:'Густа мряка',
  56:'Морозна мряка',57:'Густа морозна мряка',
  61:'Невеликий дощ',63:'Помірний дощ',65:'Сильний дощ',
  71:'Сніг',73:'Помірний сніг',75:'Сильний сніг',77:'Снігопад',
  80:'Зливи',81:'Помірні зливи',82:'Сильні зливи',
  85:'Снігові опади',86:'Сильні снігові опади',
  95:'Гроза',96:'Гроза з градом',99:'Гроза з сильним градом',
};

const ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',
  45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌦️',56:'🌦️',57:'🌦️',
  61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'🌨️',75:'🌨️',77:'🌨️',
  80:'🌧️',81:'🌧️',82:'🌧️',
  85:'🌨️',86:'🌨️',
  95:'⛈️',96:'⛈️',99:'⛈️',
};

const SKY_CLASS = {
  0:'sky-clear',1:'sky-clear',2:'sky-clouds',3:'sky-clouds',
  45:'sky-fog',48:'sky-fog',
  51:'sky-rain',53:'sky-rain',55:'sky-rain',56:'sky-rain',57:'sky-rain',
  61:'sky-rain',63:'sky-rain',65:'sky-rain',
  80:'sky-rain',81:'sky-rain',82:'sky-rain',
  71:'sky-snow',73:'sky-snow',75:'sky-snow',77:'sky-snow',85:'sky-snow',86:'sky-snow',
  95:'sky-storm',96:'sky-storm',99:'sky-storm',
};

const SKY_MODE = {
  'sky-clear':'clear','sky-clouds':'clouds','sky-fog':'fog',
  'sky-rain':'rain','sky-snow':'snow','sky-storm':'storm',
};

function wdesc(c) { return WC[c] || 'Невідомо'; }
function wicon(c) { return ICONS[c] || '🌤️'; }
function skyClass(c) { return SKY_CLASS[c] || 'sky-clouds'; }

/* ── DOM refs ────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const weatherDiv    = $('weather');
const statsRow      = $('stats-row');
const adWidgetLeft  = $('ad-widget-left');
const adWidgetRight = $('ad-widget-right');

/* ── Live clock ──────────────────────────────────────── */
function startClock() {
  const tEl = $('clock-time'), dEl = $('clock-date');
  const days = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
  const mons = ['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
  function tick() {
    const n = new Date();
    tEl.textContent = n.toLocaleTimeString('uk-UA', { hour:'2-digit', minute:'2-digit' });
    dEl.textContent = `${days[n.getDay()]} · ${n.getDate()} ${mons[n.getMonth()]}`;
  }
  tick(); setInterval(tick, 1000);
}

/* ════════════════════════════════════════════════════════
   SKY CANVAS — cinematic particle engine
════════════════════════════════════════════════════════ */
const canvas = $('sky-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let skyMode = 'clear';
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Particle class */
class Particle {
  constructor(mode) {
    this.mode = mode;
    this.reset(true);
  }

  reset(initial = false) {
    const m = this.mode, W = canvas.width, H = canvas.height;
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -20;

    switch (m) {
      case 'rain':
        this.vx = -0.8 - Math.random() * 1.5;
        this.vy = 9 + Math.random() * 7;
        this.size = 0.4 + Math.random() * 0.7;
        this.opacity = 0.12 + Math.random() * 0.25;
        this.len = 14 + Math.random() * 12;
        break;
      case 'storm':
        this.vx = -3 - Math.random() * 3;
        this.vy = 16 + Math.random() * 10;
        this.size = 0.3 + Math.random() * 0.5;
        this.opacity = 0.08 + Math.random() * 0.15;
        this.len = 22 + Math.random() * 18;
        break;
      case 'snow':
        this.vx = -0.3 + Math.random() * 0.6;
        this.vy = 0.5 + Math.random() * 1.4;
        this.size = 1.8 + Math.random() * 3.5;
        this.opacity = 0.45 + Math.random() * 0.45;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.01 + Math.random() * 0.015;
        break;
      case 'fog':
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : Math.random() * H;
        this.vx = -0.1 + Math.random() * 0.2;
        this.vy = -0.05 + Math.random() * 0.1;
        this.size = 80 + Math.random() * 180;
        this.opacity = 0.02 + Math.random() * 0.04;
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = 0.003 + Math.random() * 0.005;
        break;
      default: // stars: clear, clouds
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : Math.random() * H;
        this.size = 0.3 + Math.random() * (m === 'clear' ? 2.2 : 1.0);
        this.opacity = m === 'clear'
          ? 0.15 + Math.random() * 0.75
          : 0.05 + Math.random() * 0.25;
        this.twinkleSpeed = 0.004 + Math.random() * 0.014;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        this.vx = 0; this.vy = 0;
        break;
    }
  }

  update() {
    const m = this.mode, W = canvas.width, H = canvas.height;
    if (m === 'rain' || m === 'storm') {
      this.x += this.vx; this.y += this.vy;
      if (this.y > H + 30 || this.x < -100) this.reset();
    } else if (m === 'snow') {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.5;
      this.y += this.vy;
      if (this.y > H + 15) this.reset();
    } else if (m === 'fog') {
      this.phase += this.phaseSpeed;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity = (0.02 + Math.random() * 0.02) * (0.7 + 0.3 * Math.sin(this.phase));
      if (this.x > W + this.size) this.x = -this.size;
      if (this.x < -this.size) this.x = W + this.size;
      if (this.y > H + this.size) this.y = -this.size;
      if (this.y < -this.size) this.y = H + this.size;
    } else {
      // twinkle
      this.opacity += this.twinkleSpeed * this.twinkleDir;
      if (this.opacity >= 0.85 || this.opacity <= 0.05) this.twinkleDir *= -1;
    }
  }

  draw() {
    const m = this.mode;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

    if (m === 'rain' || m === 'storm') {
      ctx.strokeStyle = m === 'storm' ? '#8faeff' : '#b0ceff';
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const ratio = this.len / this.vy;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * ratio * 2, this.y + this.len);
      ctx.stroke();
    } else if (m === 'snow') {
      ctx.fillStyle = '#e8f2ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      // snowflake shine
      if (this.size > 2.5) {
        ctx.globalAlpha *= 0.6;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (m === 'fog') {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, 'rgba(180,195,215,0.08)');
      grad.addColorStop(1, 'rgba(180,195,215,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // star — add subtle colour to bright ones
      const brightness = this.opacity;
      const col = brightness > 0.5 ? '#fffef0' : '#ddeeff';
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      // cross flare for big bright stars
      if (this.size > 1.6 && brightness > 0.5 && m === 'clear') {
        ctx.globalAlpha *= 0.35;
        ctx.strokeStyle = '#fffde8';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 3, this.y);
        ctx.lineTo(this.x + this.size * 3, this.y);
        ctx.moveTo(this.x, this.y - this.size * 3);
        ctx.lineTo(this.x, this.y + this.size * 3);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

/* Shooting star */
class ShootingStar {
  constructor() { this.reset(); }
  reset() {
    const W = canvas.width, H = canvas.height;
    this.x = Math.random() * W * 0.7;
    this.y = Math.random() * H * 0.4;
    this.vx = 4 + Math.random() * 6;
    this.vy = 2 + Math.random() * 3;
    this.len = 80 + Math.random() * 100;
    this.life = 1;
    this.decay = 0.025 + Math.random() * 0.02;
    this.active = false;
  }
  update() {
    if (!this.active) return;
    this.x += this.vx; this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0) { this.reset(); }
  }
  draw() {
    if (!this.active || this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len * 0.5);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y - this.len * 0.5);
    ctx.stroke();
    ctx.restore();
  }
}

let shootingStar = new ShootingStar();
let shootingStarTimer = 0;

/* Lightning */
let lightningTimer = 0;

function initParticles(mode) {
  skyMode = mode;
  const counts = { clear: 160, clouds: 70, fog: 18, rain: 220, snow: 180, storm: 280 };
  const n = counts[mode] || 100;
  particles = Array.from({ length: n }, () => new Particle(mode));
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Lightning for storm
  if (skyMode === 'storm') {
    lightningTimer--;
    if (lightningTimer <= 0) {
      lightningTimer = 60 + Math.floor(Math.random() * 100);
      if (Math.random() > 0.25) {
        ctx.save();
        ctx.strokeStyle = 'rgba(210,225,255,0.65)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(200,215,255,0.9)';
        ctx.shadowBlur = 16;
        const lx = canvas.width * 0.15 + Math.random() * canvas.width * 0.7;
        ctx.beginPath();
        let cy = 0, cx = lx;
        ctx.moveTo(cx, cy);
        while (cy < canvas.height * 0.65) {
          cx += -35 + Math.random() * 70;
          cy += 35 + Math.random() * 55;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        // branch
        if (Math.random() > 0.5) {
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          let bx = cx, by = cy;
          for (let i = 0; i < 3; i++) {
            bx += -25 + Math.random() * 50;
            by += 25 + Math.random() * 35;
            ctx.lineTo(bx, by);
          }
          ctx.stroke();
        }
        ctx.restore();
        // flash
        ctx.fillStyle = 'rgba(200,210,255,0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  // Shooting star (clear sky only)
  if (skyMode === 'clear') {
    shootingStarTimer--;
    if (shootingStarTimer <= 0) {
      shootingStarTimer = 180 + Math.floor(Math.random() * 300);
      shootingStar.reset();
      shootingStar.active = true;
    }
    shootingStar.update();
    shootingStar.draw();
  }

  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(drawFrame);
}

function setSky(code) {
  const cls = skyClass(code);
  const mode = SKY_MODE[cls] || 'clear';
  ['sky-clear','sky-clouds','sky-fog','sky-rain','sky-snow','sky-storm']
    .forEach(c => document.body.classList.remove(c));
  document.body.classList.add(cls);
  if (animFrame) cancelAnimationFrame(animFrame);
  initParticles(mode);
  drawFrame();
}

/* ── Map ─────────────────────────────────────────────── */
let map, mapMarkers = [];
function saveMapMarkers() { try { localStorage.setItem('mapMarkers', JSON.stringify(mapMarkers)); } catch(e) {} }
function loadMapMarkers() { try { const s = localStorage.getItem('mapMarkers'); if (s) mapMarkers = JSON.parse(s); } catch(e) { mapMarkers = []; } }

function showMap(lat, lon, city) {
  const mc = $('map-container');
  if (!mc || typeof L === 'undefined') return;
  try {
    mc.style.display = 'block'; mc.classList.add('active');
    if (map) { map.remove(); map = null; }
    map = L.map('map', { zoomControl: true }).setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM', maxZoom: 18 }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${city}</b>`).openPopup();
    mapMarkers.forEach(m => L.marker([m.lat, m.lon]).addTo(map).bindPopup(`<b>${m.name}</b>`));
    map.on('click', e => {
      const name = prompt('Назва мітки:', '');
      if (name && name.trim()) {
        mapMarkers.push({ lat: e.latlng.lat, lon: e.latlng.lng, name: name.trim() });
        saveMapMarkers();
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
      }
    });
  } catch(e) { console.error('Map error', e); }
}

/* ── Loading / Error ─────────────────────────────────── */
function showLoading() {
  weatherDiv.innerHTML = `<div class="loading"><div class="loading-spinner"></div><span>Завантаження даних...</span></div>`;
  statsRow.innerHTML = '';
  $('weater10').innerHTML = '';
  const cs = $('chart-section');
  if (cs) cs.style.display = 'none';
}

function showError(msg) {
  weatherDiv.innerHTML = `<div class="error-container"><p class="error-message">${msg}</p><p class="error-hint">💡 Спробуйте ввести назву іншою мовою або перевірте правопис</p></div>`;
  statsRow.innerHTML = '';
  $('weater10').innerHTML = '';
}

/* ── Main fetch ──────────────────────────────────────── */
async function getWeather(city) {
  showLoading();
  try {
    if (!city || city.length < 2) { showError('Введіть назву міста (мін. 2 символи)'); return; }
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=uk&format=json`);
    if (!geoRes.ok) throw new Error(`HTTP ${geoRes.status}`);
    const geoData = await geoRes.json();
    if (!geoData.results || !geoData.results.length) {
      showError(`❌ Місто "<strong>${city}</strong>" не знайдено`); return;
    }
    const { latitude: lat, longitude: lon, name, country, admin1, population } = geoData.results[0];

    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,uv_index_max,sunrise,sunset,precipitation_sum` +
      `&timezone=auto`
    );
    if (!wRes.ok) throw new Error('Weather API error');
    const wData = await wRes.json();

    displayWeather(name, country, admin1, population, wData);
    displayStats(wData);
    displayForecast(wData);
    displayChart(wData);
    showMap(lat, lon, name);
  } catch(err) {
    console.error(err);
    if (err.message.includes('fetch')) showError('🌐 Немає підключення до інтернету');
    else showError('❌ Щось пішло не так. Спробуйте пізніше.');
  }
}

/* ── Display weather hero ────────────────────────────── */
function displayWeather(city, country, admin1, population, data) {
  const c    = data.current;
  const temp = Math.round(c.temperature_2m);
  const feel = Math.round(c.apparent_temperature);
  const code = c.weather_code;
  const wind = Math.round(c.wind_speed_10m);
  const wdir = c.wind_direction_10m || 0;
  const hum  = c.relative_humidity_2m;
  const pres = Math.round(c.surface_pressure);
  const icon = wicon(code);
  const desc = wdesc(code);
  const region = admin1 ? `${admin1}, ${country}` : country;
  const popStr = population ? `${(population / 1e6).toFixed(1)}M мешк.` : '';
  const time = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  setSky(code);

  weatherDiv.innerHTML = `
    <div class="weather-content">
      <div class="hero-top">
        <div class="weather-left">
          <div class="city-block">
            <div class="city-name">${city}</div>
            <div class="city-meta">
              <span class="city-region">${region}</span>
              ${popStr ? `<span class="city-pop">${popStr}</span>` : ''}
            </div>
          </div>
          <div class="temp-block">
            <span class="temp-number">${temp}</span>
            <span class="temp-unit">°C</span>
          </div>
          <div class="weather-desc">${desc}</div>
        </div>
        <div class="hero-right">
          <div class="weather-icon-big">${icon}</div>
          <div class="feels-pill">відчувається як ${feel}°C</div>
        </div>
      </div>
      <div class="hero-details">
        <div class="detail-item"><span class="d-icon">💧</span> Вологість <strong>${hum}%</strong></div>
        <div class="detail-item">
          <span class="d-icon">💨</span> Вітер
          <strong>${wind} км/г</strong>
          <span style="display:inline-block;transform:rotate(${wdir}deg);margin-left:3px">↑</span>
        </div>
        <div class="detail-item"><span class="d-icon">🌡</span> Тиск <strong>${pres} гПа</strong></div>
        <span class="update-time">🕐 ${time}</span>
      </div>
    </div>`;
}

/* ── Stats ───────────────────────────────────────────── */
function displayStats(data) {
  const d = data.daily;
  if (!d) return;

  const uv     = Math.round(d.uv_index_max?.[0] ?? 0);
  const uvW    = Math.min(100, uv / 12 * 100);
  const uvLbl  = uv <= 2 ? 'Низький' : uv <= 5 ? 'Помірний' : uv <= 7 ? 'Високий' : uv <= 10 ? 'Дуже вис.' : 'Екстрем.';
  const sr     = d.sunrise?.[0] ? new Date(d.sunrise[0]).toLocaleTimeString('uk-UA', { hour:'2-digit', minute:'2-digit' }) : '—';
  const ss     = d.sunset?.[0]  ? new Date(d.sunset[0]).toLocaleTimeString('uk-UA',  { hour:'2-digit', minute:'2-digit' }) : '—';
  const precip = (d.precipitation_sum?.[0] ?? 0).toFixed(1);
  const maxT   = Math.round(d.temperature_2m_max?.[0] ?? 0);
  const minT   = Math.round(d.temperature_2m_min?.[0] ?? 0);

  statsRow.innerHTML = `
    <div class="stat-card">
      <span class="s-icon">🌅</span>
      <span class="s-val">${sr}</span>
      <span class="s-lbl">Схід сонця</span>
    </div>
    <div class="stat-card">
      <span class="s-icon">🌇</span>
      <span class="s-val">${ss}</span>
      <span class="s-lbl">Захід сонця</span>
    </div>
    <div class="stat-card">
      <span class="s-icon">☀️</span>
      <span class="s-val">${uv} <small style="font-size:.55em;font-weight:300;color:var(--t3)">${uvLbl}</small></span>
      <div class="uv-bar-wrap"><div class="uv-bar" style="width:${uvW}%"></div></div>
      <span class="s-lbl">UV-індекс</span>
    </div>
    <div class="stat-card">
      <span class="s-icon">🌧️</span>
      <span class="s-val">${precip} <small style="font-size:.55em;font-weight:300;color:var(--t3)">мм</small></span>
      <span class="s-lbl">Опади</span>
    </div>
    <div class="stat-card">
      <span class="s-icon">🌡</span>
      <span class="s-val"><span style="color:var(--accent)">${maxT}°</span> / ${minT}°</span>
      <span class="s-lbl">Макс / Мін</span>
    </div>`;
}

/* ── Forecast — rebuilt with temp bars ───────────────── */
function fmtDay(dateStr) {
  const d = new Date(dateStr);
  const days = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
  return `${days[d.getDay()]}<br>${d.getDate()}/${d.getMonth()+1}`;
}

function displayForecast(data) {
  const { time, temperature_2m_max: maxArr, temperature_2m_min: minArr,
          weather_code: codes, wind_speed_10m_max: windArr } = data.daily;
  const today = new Date().toDateString();

  // Global min/max across all days — for relative bar width
  const globalMax = Math.max(...maxArr);
  const globalMin = Math.min(...minArr);
  const globalRange = (globalMax - globalMin) || 1;

  let html = '<div class="forecast-container">';
  for (let i = 0; i < time.length; i++) {
    const isToday = new Date(time[i]).toDateString() === today;
    const maxT = Math.round(maxArr[i]);
    const minT = Math.round(minArr[i]);
    const wind = Math.round(windArr[i]);
    // bar width = how warm this day is relative to the full range
    const barW = Math.round(((maxT - globalMin) / globalRange) * 100);

    html += `
      <div class="forecast-day${isToday ? ' today' : ''}">
        <span class="fd-day">${fmtDay(time[i])}</span>
        <span class="fd-icon">${wicon(codes[i])}</span>
        <div class="fd-temps">
          <span class="fd-max">${maxT}°</span>
          <span class="fd-sep">/</span>
          <span class="fd-min">${minT}°</span>
        </div>
        <div class="fd-bar-wrap">
          <div class="fd-bar" style="width:${barW}%"></div>
        </div>
        <p class="fd-desc">${wdesc(codes[i])}</p>
        <p class="fd-wind">💨 ${wind} км/г</p>
        ${isToday ? '<div class="today-badge">Сьогодні</div>' : ''}
      </div>`;
  }
  html += '</div>';
  $('weater10').innerHTML = html;
}

/* ── Temperature chart ───────────────────────────────── */
function displayChart(data) {
  const cs = $('chart-section'), chartCanvas = $('temp-chart');
  if (!cs || !chartCanvas) return;
  cs.style.display = 'block';

  const mx    = data.daily.temperature_2m_max;
  const mn    = data.daily.temperature_2m_min;
  const dates = data.daily.time;
  if (!mx || !mx.length) return;

  const dpr  = window.devicePixelRatio || 1;
  const wrap = $('temp-chart-wrap');
  const W    = wrap.clientWidth - 40;
  const H    = 160;
  chartCanvas.width  = W * dpr; chartCanvas.height = H * dpr;
  chartCanvas.style.width = W + 'px'; chartCanvas.style.height = H + 'px';
  const c = chartCanvas.getContext('2d');
  c.scale(dpr, dpr);

  const all  = [...mx, ...mn];
  const minT = Math.min(...all) - 2;
  const maxT = Math.max(...all) + 2;
  const rng  = maxT - minT || 1;
  const n    = mx.length;
  const pad  = 22;
  const pw   = W - pad * 2;
  const ph   = H - pad * 2;

  const xOf = i => pad + i * (pw / (n - 1));
  const yOf = v => pad + ph - ((v - minT) / rng * ph);

  // Grid
  c.strokeStyle = 'rgba(255,255,255,0.04)';
  c.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + i * (ph / 4);
    c.beginPath(); c.moveTo(pad, y); c.lineTo(W - pad, y); c.stroke();
  }

  // Smooth curve helper
  function drawCurve(vals, strokeCol, fillTop, fillBot) {
    const grd = c.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, fillTop); grd.addColorStop(1, fillBot);
    c.fillStyle = grd;
    c.beginPath(); c.moveTo(xOf(0), yOf(vals[0]));
    for (let i = 1; i < n; i++) {
      const cx = (xOf(i-1) + xOf(i)) / 2;
      c.bezierCurveTo(cx, yOf(vals[i-1]), cx, yOf(vals[i]), xOf(i), yOf(vals[i]));
    }
    c.lineTo(xOf(n-1), H); c.lineTo(xOf(0), H); c.closePath(); c.fill();

    c.strokeStyle = strokeCol; c.lineWidth = 2.5;
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(xOf(0), yOf(vals[0]));
    for (let i = 1; i < n; i++) {
      const cx = (xOf(i-1) + xOf(i)) / 2;
      c.bezierCurveTo(cx, yOf(vals[i-1]), cx, yOf(vals[i]), xOf(i), yOf(vals[i]));
    }
    c.stroke();
  }

  drawCurve(mx, 'rgba(251,191,36,0.95)', 'rgba(251,191,36,0.28)', 'rgba(251,191,36,0)');
  drawCurve(mn, 'rgba(96,165,250,0.9)',  'rgba(96,165,250,0.22)', 'rgba(96,165,250,0)');

  // Dots on max line
  c.fillStyle = 'rgba(251,191,36,0.95)';
  for (let i = 0; i < n; i++) {
    c.beginPath(); c.arc(xOf(i), yOf(mx[i]), 2.5, 0, Math.PI * 2); c.fill();
  }

  // Date labels
  c.fillStyle = 'rgba(240,244,255,0.38)';
  c.font = '10px Outfit, sans-serif';
  c.textAlign = 'center';
  const every = n > 7 ? 2 : 1;
  for (let i = 0; i < n; i += every) {
    const d = new Date(dates[i]);
    c.fillText(`${d.getDate()}/${d.getMonth()+1}`, xOf(i), H - 4);
  }

  // Max temp labels
  c.fillStyle = 'rgba(251,191,36,0.92)';
  c.font = 'bold 10px Outfit, sans-serif';
  for (let i = 0; i < n; i += every) {
    c.fillText(Math.round(mx[i]) + '°', xOf(i), yOf(mx[i]) - 7);
  }
}

/* ── Event bindings ──────────────────────────────────── */
function performSearch() {
  const city = $('search-input').value.trim();
  if (city) getWeather(city);
  else showError('Будь ласка, введіть назву міста');
}

$('search-button').addEventListener('click', performSearch);
$('search-input').addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });
$('country-select').addEventListener('change', e => {
  const city = e.target.options[e.target.selectedIndex].text.replace(/^[\p{Emoji}\s]+/u, '').trim();
  $('search-input').value = '';
  getWeather(city);
});
$('search-input').addEventListener('input', () => { $('country-select').value = ''; });

/* ── Ad toggle ───────────────────────────────────────── */
function initAdToggle() {
  const btn = $('toggle-ad-btn');
  if (!btn) return;
  let on; try { on = localStorage.getItem('adEnabled') !== 'false'; } catch(e) { on = true; }
  if (!on) { document.body.classList.add('ad-hidden'); btn.textContent = '✅ Показати рекламу'; }
  btn.addEventListener('click', () => {
    let cur; try { cur = localStorage.getItem('adEnabled') !== 'false'; } catch(e) { cur = true; }
    try { localStorage.setItem('adEnabled', String(!cur)); } catch(e) {}
    document.body.classList.toggle('ad-hidden', cur);
    btn.textContent = cur ? '✅ Показати рекламу' : '❌ Сховати рекламу';
  });
}

/* ── Ad loader ───────────────────────────────────────── */
async function loadAd() {
  if (!adWidgetLeft || !adWidgetRight) return;
  try {
    const res = await fetch('reklama.json');
    if (!res.ok) return;
    const ads = await res.json();
    if (!ads || ads.length < 6) return;
    const shuffled = [...ads].sort(() => Math.random() - 0.5);
    const render = list => list.map(a => `
      <div class="ad-item">
        <img class="ad-image" src="${a.image}" alt="${a.name}" loading="lazy"/>
        <p class="ad-name">${a.name}</p>
      </div>`).join('');
    adWidgetLeft.innerHTML  = render(shuffled.slice(0, 3));
    adWidgetRight.innerHTML = render(shuffled.slice(3, 6));
  } catch(e) { console.warn('Ad load failed'); }
}

/* ── Init ────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  startClock();
  initParticles('clear');
  drawFrame();
  loadMapMarkers();
  initAdToggle();
  loadAd();

  const defaultCity = $('country-select').options[$('country-select').selectedIndex]
    .text.replace(/^[\p{Emoji}\s]+/u, '').trim();
  getWeather(defaultCity);
});