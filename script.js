/* ==========================================================================
   Config
   ========================================================================== */

const BASE_URL = "https://api.thomasdalzell.co.uk/weather";
const API_KEY = "1908153cff66fadc3c1d679a24f04d34";
const DEFAULT_CITY = "Belfast";

/* ==========================================================================
   DOM Elements
   ========================================================================== */

const weatherCard = document.getElementById("weather-card");
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

/* ==========================================================================
   Helpers
   ========================================================================== */

function getWeatherIcon(description = "") {
  const text = description.toLowerCase();

  if (text.includes("cloud")) return "fas fa-cloud";
  if (text.includes("rain")) return "fas fa-cloud-showers-heavy";
  if (text.includes("sun") || text.includes("clear")) return "fas fa-sun";
  if (text.includes("snow")) return "fas fa-snowflake";

  return "fas fa-smog";
}

function kmhToMph(kmh) {
  return (kmh * 0.621371).toFixed(1);
}

function renderLoading() {
  weatherCard.innerHTML = "<p>Loading weather...</p>";
}

function renderError(city) {
  weatherCard.innerHTML = `
    <p style="color:red;">⚠️ Failed to load weather for "${city}"</p>
  `;
}

function renderWeather(data) {
  const icon = getWeatherIcon(data.weather_descriptions?.[0] || "");
  const windMph = kmhToMph(data.wind_speed_kmh);

  weatherCard.innerHTML = `
    <div style="text-align:center;">
      <i class="${icon}" style="font-size:48px; margin-bottom:10px;"></i>

      <h2>${data.location}, ${data.country}</h2>

      <div style="font-size:4em; font-weight:bold;">
        ${data.temperature_c}°C
      </div>

      <p style="font-size:1.5em; margin-bottom:15px;">
        ${data.weather_descriptions[0]}
      </p>

      <p>Feels like: <strong>${data.feelslike_c}°C</strong></p>
      <p>💨 Wind: <strong>${windMph} mph</strong></p>
      <p>💧 Humidity: <strong>${data.humidity}%</strong></p>

      <small>${data.datetime}</small>
    </div>
  `;
}

/* ==========================================================================
   API
   ========================================================================== */

async function fetchWeather(city) {
  renderLoading();

  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(city)}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    console.error(error);
    renderError(city);
  }
}

/* ==========================================================================
   Events
   ========================================================================== */

function handleSearch() {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

/* ==========================================================================
   Init
   ========================================================================== */

window.addEventListener("load", () => {
  fetchWeather(DEFAULT_CITY);
});
