'use strict';

/* â”€â”€ Weather code maps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const WC = {
  0:'Ð¯ÑÐ½Ð¾',1:'ÐŸÐµÑ€ÐµÐ²Ð°Ð¶Ð½Ð¾ ÑÑÐ½Ð¾',2:'Ð§Ð°ÑÑ‚ÐºÐ¾Ð²Ð¾ Ñ…Ð¼Ð°Ñ€Ð½Ð¾',3:'Ð¥Ð¼Ð°Ñ€Ð½Ð¾',
  45:'Ð¢ÑƒÐ¼Ð°Ð½',48:'Ð†Ð½Ñ–Ð¹',
  51:'Ð›ÐµÐ³ÐºÐ° Ð¼Ñ€ÑÐºÐ°',53:'ÐŸÐ¾Ð¼Ñ–Ñ€Ð½Ð° Ð¼Ñ€ÑÐºÐ°',55:'Ð“ÑƒÑÑ‚Ð° Ð¼Ñ€ÑÐºÐ°',
  56:'ÐœÐ¾Ñ€Ð¾Ð·Ð½Ð° Ð¼Ñ€ÑÐºÐ°',57:'Ð“ÑƒÑÑ‚Ð° Ð¼Ð¾Ñ€Ð¾Ð·Ð½Ð° Ð¼Ñ€ÑÐºÐ°',
  61:'ÐÐµÐ²ÐµÐ»Ð¸ÐºÐ¸Ð¹ Ð´Ð¾Ñ‰',63:'ÐŸÐ¾Ð¼Ñ–Ñ€Ð½Ð¸Ð¹ Ð´Ð¾Ñ‰',65:'Ð¡Ð¸Ð»ÑŒÐ½Ð¸Ð¹ Ð´Ð¾Ñ‰',
  71:'Ð¡Ð½Ñ–Ð³',73:'ÐŸÐ¾Ð¼Ñ–Ñ€Ð½Ð¸Ð¹ ÑÐ½Ñ–Ð³',75:'Ð¡Ð¸Ð»ÑŒÐ½Ð¸Ð¹ ÑÐ½Ñ–Ð³',77:'Ð¡Ð½Ñ–Ð³Ð¾Ð¿Ð°Ð´',
  80:'Ð—Ð»Ð¸Ð²Ð¸',81:'ÐŸÐ¾Ð¼Ñ–Ñ€Ð½Ñ– Ð·Ð»Ð¸Ð²Ð¸',82:'Ð¡Ð¸Ð»ÑŒÐ½Ñ– Ð·Ð»Ð¸Ð²Ð¸',
  85:'Ð¡Ð½Ñ–Ð³Ð¾Ð²Ñ– Ð¾Ð¿Ð°Ð´Ð¸',86:'Ð¡Ð¸Ð»ÑŒÐ½Ñ– ÑÐ½Ñ–Ð³Ð¾Ð²Ñ– Ð¾Ð¿Ð°Ð´Ð¸',
  95:'Ð“Ñ€Ð¾Ð·Ð°',96:'Ð“Ñ€Ð¾Ð·Ð° Ð· Ð³Ñ€Ð°Ð´Ð¾Ð¼',99:'Ð“Ñ€Ð¾Ð·Ð° Ð· ÑÐ¸Ð»ÑŒÐ½Ð¸Ð¼ Ð³Ñ€Ð°Ð´Ð¾Ð¼',
};

const ICONS = {
  0:'â˜€ï¸',1:'ðŸŒ¤ï¸',2:'â›…',3:'â˜ï¸',
  45:'ðŸŒ«ï¸',48:'ðŸŒ«ï¸',
  51:'ðŸŒ¦ï¸',53:'ðŸŒ¦ï¸',55:'ðŸŒ¦ï¸',56:'ðŸŒ¦ï¸',57:'ðŸŒ¦ï¸',
  61:'ðŸŒ§ï¸',63:'ðŸŒ§ï¸',65:'ðŸŒ§ï¸',
  71:'ðŸŒ¨ï¸',73:'ðŸŒ¨ï¸',75:'ðŸŒ¨ï¸',77:'ðŸŒ¨ï¸',
  80:'ðŸŒ§ï¸',81:'ðŸŒ§ï¸',82:'ðŸŒ§ï¸',
  85:'ðŸŒ¨ï¸',86:'ðŸŒ¨ï¸',
  95:'â›ˆï¸',96:'â›ˆï¸',99:'â›ˆï¸',
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

function wdesc(c) { return WC[c] || 'ÐÐµÐ²Ñ–Ð´Ð¾Ð¼Ð¾'; }
function wicon(c) { return ICONS[c] || 'ðŸŒ¤ï¸'; }
function skyClass(c) { return SKY_CLASS[c] || 'sky-clouds'; }

/* â”€â”€ DOM refs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const $  = id => document.getElementById(id);
const weatherDiv    = $('weather');
const statsRow      = $('stats-row');
const adWidgetLeft  = $('ad-widget-left');
const adWidgetRight = $('ad-widget-right');

/* â”€â”€ Live clock â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function startClock() {
  const tEl = $('clock-time'), dEl = $('clock-date');
  const days = ['ÐÐ´','ÐŸÐ½','Ð’Ñ‚','Ð¡Ñ€','Ð§Ñ‚','ÐŸÑ‚','Ð¡Ð±'];
  const mons = ['Ð¡Ñ–Ñ‡','Ð›ÑŽÑ‚','Ð‘ÐµÑ€','ÐšÐ²Ñ–','Ð¢Ñ€Ð°','Ð§ÐµÑ€','Ð›Ð¸Ð¿','Ð¡ÐµÑ€','Ð’ÐµÑ€','Ð–Ð¾Ð²','Ð›Ð¸Ñ','Ð“Ñ€Ñƒ'];
  function tick() {
    const n = new Date();
    tEl.textContent = n.toLocaleTimeString('uk-UA', { hour:'2-digit', minute:'2-digit' });
    dEl.textContent = `${days[n.getDay()]} Â· ${n.getDate()} ${mons[n.getMonth()]}`;
  }
  tick(); setInterval(tick, 1000);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SKY CANVAS â€” cinematic particle engine
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
      // star â€” add subtle colour to bright ones
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

/* â”€â”€ Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Â© OSM', maxZoom: 18 }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${city}</b>`).openPopup();
    mapMarkers.forEach(m => L.marker([m.lat, m.lon]).addTo(map).bindPopup(`<b>${m.name}</b>`));
    map.on('click', e => {
      const name = prompt('ÐÐ°Ð·Ð²Ð° Ð¼Ñ–Ñ‚ÐºÐ¸:', '');
      if (name && name.trim()) {
        mapMarkers.push({ lat: e.latlng.lat, lon: e.latlng.lng, name: name.trim() });
        saveMapMarkers();
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
      }
    });
  } catch(e) { console.error('Map error', e); }
}

/* â”€â”€ Loading / Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function showLoading() {
  weatherDiv.innerHTML = `<div class="loading"><div class="loading-spinner"></div><span>Ð—Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÐµÐ½Ð½Ñ Ð´Ð°Ð½Ð¸Ñ…...</span></div>`;
  statsRow.innerHTML = '';
  $('weater10').innerHTML = '';
  const cs = $('chart-section');
  if (cs) cs.style.display = 'none';
}

function showError(msg) {
  weatherDiv.innerHTML = `<div class="error-container"><p class="error-message">${msg}</p><p class="error-hint">ðŸ’¡ Ð¡Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ð²Ð²ÐµÑÑ‚Ð¸ Ð½Ð°Ð·Ð²Ñƒ Ñ–Ð½ÑˆÐ¾ÑŽ Ð¼Ð¾Ð²Ð¾ÑŽ Ð°Ð±Ð¾ Ð¿ÐµÑ€ÐµÐ²Ñ–Ñ€Ñ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾Ð¿Ð¸Ñ</p></div>`;
  statsRow.innerHTML = '';
  $('weater10').innerHTML = '';
}

/* â”€â”€ Main fetch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function getWeather(city) {
  showLoading();
  try {
    if (!city || city.length < 2) { showError('Ð’Ð²ÐµÐ´Ñ–Ñ‚ÑŒ Ð½Ð°Ð·Ð²Ñƒ Ð¼Ñ–ÑÑ‚Ð° (Ð¼Ñ–Ð½. 2 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¸)'); return; }
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=uk&format=json`);
    if (!geoRes.ok) throw new Error(`HTTP ${geoRes.status}`);
    const geoData = await geoRes.json();
    if (!geoData.results || !geoData.results.length) {
      showError(`âŒ ÐœÑ–ÑÑ‚Ð¾ "<strong>${city}</strong>" Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾`); return;
    }
