// Base URL for my FastAPI backend
const BASE_URL = "https://api.thomasdalzell.co.uk/weather";
const apiUrl = "https://api.thomasdalzell.co.uk/weather/Belfast?api_key=1908153cff66fadc3c1d679a24f04d34";

// Fetch weather data for a given city
async function fetchWeather(city) {
  const card = document.getElementById("weather-card");
  card.innerHTML = "<p>Loading weather...</p>";

  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(city)}?api_key=1908153cff66fadc3c1d679a24f04d34`
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    const icon = getWeatherIcon(data.weather_descriptions[0]);

    card.innerHTML = `
      <i class="${icon}"></i>
      <h2>${data.location}, ${data.country}</h2>
      <p><strong>${data.temperature_c}°C</strong> - ${data.weather_descriptions[0]}</p>
      <p>Feels like: ${data.feelslike_c}°C</p>
      <p>💨 Wind: ${data.wind_speed_kmh} km/h</p>
      <p>💧 Humidity: ${data.humidity}%</p>
      <small>${data.datetime}</small>
    `;
  } catch (err) {
    card.innerHTML = `<p style="color:red;">⚠️ Failed to load weather for "${city}"</p>`;
    console.error(err);
  }
}

function getWeatherIcon(description) {
  description = description.toLowerCase();
  if (description.includes("cloud")) return "fas fa-cloud";
  if (description.includes("rain")) return "fas fa-cloud-showers-heavy";
  if (description.includes("sun") || description.includes("clear")) return "fas fa-sun";
  if (description.includes("snow")) return "fas fa-snowflake";
  return "fas fa-smog";
}

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) fetchWeather(city);
});

document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("search-btn").click();
});

// Load default city on page load
window.onload = () => fetchWeather("Belfast");
