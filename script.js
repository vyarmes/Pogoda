let map;
let currentLat, currentLon;
let markers = [];

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const countrySelect = document.getElementById('country-select');
const weatherDiv = document.getElementById('weather');
const weather10Div = document.getElementById('weater10');
const adWidgetLeft = document.getElementById('ad-widget-left');
const adWidgetRight = document.getElementById('ad-widget-right');
const bottomBtn = document.getElementById('bottom-btn');

const WEATHER_CODES = {
  0: 'Ясно', 1: 'Переважно ясно', 2: 'Частково хмарно', 3: 'Хмарно',
  45: 'Туман', 48: 'Іній', 51: 'Легка мряка', 53: 'Помірна мряка',
  55: 'Густа мряка', 56: 'Легкий морозний дощ', 57: 'Густа мряка з морозом',
  61: 'Невеликий дощ', 63: 'Помірний дощ', 65: 'Сильний дощ',
  71: 'Невеликий сніг', 73: 'Помірний сніг', 75: 'Сильний сніг',
  77: 'Снігопад', 80: 'Слабкі зливи', 81: 'Помірні зливи',
  82: 'Сильні зливи', 85: 'Снігові опади', 86: 'Сильні снігові опади',
  95: 'Гроза', 96: 'Гроза з легким градом', 99: 'Гроза з сильним градом'
};

searchButton.addEventListener('click', () => performSearch());

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

countrySelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const cityName = selectedOption.text;
  searchInput.value = '';
  getWeather(cityName);
});

searchInput.addEventListener('input', () => {
  countrySelect.value = '';
});

function performSearch() {
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    showError('Будь ласка, введіть назву міста');
  }
}

async function getWeather(city) {
  showLoading();

  try {
    if (!city || city.length < 2) {
      showError('Назва міста повинна містити щонайменше 2 символи');
      return;
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=uk&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`HTTP error! status: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError(`❌ Місто "<strong>${city}</strong>" не знайдено. Перевірте правильність написання.`);
      return;
    }

    const { latitude, longitude, name, country, admin1, population } = geoData.results[0];
   
    currentLat = latitude;
    currentLon = longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max&timezone=auto`;
    
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Помилка отримання даних про погоду`);
    }

    const weatherData = await weatherResponse.json();

    displayCurrentWeather(name, country, admin1, population, weatherData);
    displayForecast(weatherData);

  } catch (error) {
    console.error('Помилка:', error);
    
    if (error.message.includes('Failed to fetch')) {
      showError('🌐 Помилка підключення. Перевірте своє інтернет-з\'єднання.');
    } else if (error.message.includes('HTTP error')) {
      showError('⚠️ Помилка сервера. Спробуйте пізніше.');
    } else {
      showError('❌ Упс! Щось пішло не так при завантаженні даних. Спробуйте пізніше.');
    }
  }
}

function showLoading() {
  weatherDiv.innerHTML = '<div class="loading">Завантаження погодних даних...</div>';
  weather10Div.innerHTML = '';
}

function showError(message) {
  weatherDiv.innerHTML = `
    <div class="error-container">
      <p class="error-message">${message}</p>
      <p class="error-hint">💡 Спробуйте ввести назву міста іншою мовою або перевірте правопис</p>
    </div>
  `;
  weather10Div.innerHTML = '';
}

function getWeatherDescription(code) {
  return WEATHER_CODES[code] || 'Невідомо';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if ([3, 45, 48].includes(code)) return '☁️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '🌨️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌤️';
}

function updateDynamicBackground(code, cityName) {
  let bgImage = '';
  const isKyiv = cityName.toLowerCase().includes('київ') || cityName.toLowerCase().includes('kyiv');
  const isMarrakech = cityName.toLowerCase().includes('маракеш') || cityName.toLowerCase().includes('marrakech');

  if (isMarrakech) {
    document.body.classList.add('no-styles');
    document.body.style.backgroundImage = '';
    document.body.style.background = '';
    return;
  } else {
    document.body.classList.remove('no-styles');
  }

  if (isKyiv) {
    bgImage = 'images/navalniy.jpg';
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 71, 73, 75, 77, 85, 86, 95, 96, 99].includes(code)) {
    bgImage = 'images/doch.jpg';
  } else if ([0, 1].includes(code)) {
    bgImage = 'images/sonyachno.jpg';
  } else if ([2, 3, 45, 48].includes(code)) {
    bgImage = 'images/xmarno.jpg';
  }

  if (bgImage) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = '';
  }
}

function displayCurrentWeather(city, country, admin1, population, data) {
  try {
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const wind = data.current.wind_speed_10m;
    const humidity = data.current.relative_humidity_2m;
    const icon = getWeatherIcon(code);
    const currentTime = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    
    const locationInfo = admin1 ? `${admin1}, ${country}` : country;
    const popInfo = population ? `<div class="detail-item">👥 Населення: <span>${(population / 1000000).toFixed(1)}M+</span></div>` : '';

    updateDynamicBackground(code, city);

    weatherDiv.innerHTML = `
      <div class="weather-content">
        <h2>${city}, <span class="country-code">${locationInfo}</span></h2>
        <div class="weather-main">
          <div class="weather-icon">${icon}</div>
          <div class="weather-temp">${temp}°C</div>
        </div>
        <div class="weather-description">${getWeatherDescription(code)}</div>
        <div class="weather-details">
          <div class="detail-item">💧 Вологість: <span>${humidity}%</span></div>
          <div class="detail-item">💨 Вітер: <span>${wind} км/год</span></div>
          ${popInfo}
        </div>
        <div class="weather-time">Оновлено о: ${currentTime}</div>
      </div>
    `;
    
    if (currentLat && currentLon) {
      showMap(currentLat, currentLon, city);
    }
  } catch (error) {
    console.error('Помилка при виводі погоди:', error);
    showError('❌ Помилка при обробці даних про погоду');
  }
}

function saveMarkers() {
  localStorage.setItem('mapMarkers', JSON.stringify(markers));
}

function loadMarkers() {
  const saved = localStorage.getItem('mapMarkers');
  if (saved) {
    try {
      markers = JSON.parse(saved);
    } catch (e) {
      markers = [];
    }
  }
}

function showMap(lat, lon, city) {
  const mapContainer = document.getElementById('map-container');
  
  if (!mapContainer || typeof L === 'undefined') {
    console.warn('Map container або Leaflet не знайдені');
    return;
  }
  
  if (!lat || !lon) {
    console.warn('Координати не передані');
    return;
  }
  
  try {
    mapContainer.style.display = 'block';
    
    if (map) {
      map.remove();
    }
    
    map = L.map('map').setView([lat, lon], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${city}</b>`)
      .openPopup();

    loadMarkers();
    markers.forEach(m => {
      L.marker([m.lat, m.lon])
        .addTo(map)
        .bindPopup(`<b>${m.name}</b>`);
    });

    map.on('click', function(e) {
      const markerName = prompt('Введіть назву мітки:', '');
      if (markerName) {
        const newMarker = {
          lat: e.latlng.lat,
          lon: e.latlng.lng,
          name: markerName
        };
        markers.push(newMarker);
        saveMarkers();
        L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(map)
          .bindPopup(`<b>${markerName}</b>`)
          .openPopup();
      }
    });
  } catch (error) {
    console.error('Помилка при завантаженні карти:', error);
  }
}

function displayForecast(data) {
  const dates = data.daily.time;
  const tempsMax = data.daily.temperature_2m_max;
  const tempsMin = data.daily.temperature_2m_min;
  const codes = data.daily.weather_code;
  const windMax = data.daily.wind_speed_10m_max;

  let html = '<div class="forecast-container">';

  for (let i = 0; i < dates.length; i++) {
    html += `
      <div class="forecast-day">
        <h4>${formatDate(dates[i])}</h4>
        <div class="forecast-icon">${getWeatherIcon(codes[i])}</div>
        <p class="forecast-temp">
          <span class="max-t">${Math.round(tempsMax[i])}°</span>
          <span class="min-t">${Math.round(tempsMin[i])}°</span>
        </p>
        <p class="forecast-desc">${getWeatherDescription(codes[i])}</p>
        <p class="forecast-wind">💨 ${Math.round(windMax[i])} км/г</p>
      </div>
    `;
  }

  html += '</div>';
  weather10Div.innerHTML = html;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
}

window.addEventListener('DOMContentLoaded', () => {
  loadMarkers();
  initAdToggle();
  const firstCity = countrySelect.options[countrySelect.selectedIndex].text;
  getWeather(firstCity);
  loadAd();
});

function initAdToggle() {
  const toggleBtn = document.getElementById('toggle-ad-btn');
  const adEnabled = localStorage.getItem('adEnabled') !== 'false';
  
  if (!adEnabled) {
    document.body.classList.add('ad-hidden');
    toggleBtn.textContent = 'Включити рекламу';
  }
  
  toggleBtn.addEventListener('click', () => {
    const isEnabled = localStorage.getItem('adEnabled') !== 'false';
    localStorage.setItem('adEnabled', !isEnabled);
    
    if (isEnabled) {
      document.body.classList.add('ad-hidden');
      toggleBtn.textContent = 'Включити рекламу';
    } else {
      document.body.classList.remove('ad-hidden');
      toggleBtn.textContent = 'Відключити рекламу';
    }
  });
}

async function loadAd() {
  if (!adWidgetLeft || !adWidgetRight) return;
  try {
    const response = await fetch('reklama.json');
    const ads = await response.json();
    if (!ads || ads.length < 8) return;
    const shuffled = ads.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6);

    adWidgetLeft.innerHTML = selected.slice(0, 3).map(ad => `
      <div class="ad-item">
        <img class="ad-image" src="${ad.image}" alt="${ad.name}" />
        <p class="ad-name">${ad.name}</p>
      </div>
    `).join('');

    adWidgetRight.innerHTML = selected.slice(3, 6).map(ad => `
      <div class="ad-item">
        <img class="ad-image" src="${ad.image}" alt="${ad.name}" />
        <p class="ad-name">${ad.name}</p>
      </div>
    `).join('');
  } catch (err) {
    console.warn('Не вдалося завантажити рекламу');
  }
}