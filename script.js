// 1. Get a FREE API key at https://openweathermap.org/api and paste it below.
//    (New keys can take up to ~2 hours to activate.)
const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");

function showMessage(text, isInfo = false) {
  message.textContent = text;
  message.classList.toggle("info", isInfo);
}

async function getWeather(city) {
  if (API_KEY === "YOUR_API_KEY_HERE") {
    showMessage("Add your OpenWeatherMap API key in script.js first.");
    return;
  }

  showMessage("Loading...", true);
  result.classList.add("hidden");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) throw new Error("City not found. Check the spelling.");
    if (response.status === 401) throw new Error("Invalid or not-yet-active API key.");
    if (!response.ok) throw new Error("Something went wrong. Try again.");

    const data = await response.json();
    displayWeather(data);
    showMessage("");
  } catch (error) {
    // fetch() itself throws a TypeError when there is no internet
    showMessage(error instanceof TypeError ? "Network error. Check your connection." : error.message);
  }
}

function displayWeather(data) {
  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("desc").textContent = data.weather[0].description;
  document.getElementById("feels").textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;

  const icon = document.getElementById("icon");
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  result.classList.remove("hidden");
}

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showMessage("Please enter a city name.");
    return;
  }
  getWeather(city);
}

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
