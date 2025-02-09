// const weatherApiKey = "c469214db3ece602652f65295590c4ff";
// const newsApiKey = "e3df3859a5394141aa2e6c4e1ab75167";

// Select Elements
const searchBtn = document.getElementById("searchBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const locationBtn = document.getElementById("locationBtn");
const refreshBtn = document.getElementById("refreshBtn");
const saveBtn = document.getElementById("saveBtn");
const hourlyForecastBtn = document.getElementById("hourlyForecastBtn");
const moreNewsBtn = document.getElementById("moreNewsBtn");
const shareBtn = document.getElementById("shareBtn");
const settingsBtn = document.getElementById("settingsBtn");

const cityInput = document.getElementById("cityInput");
const weatherDetails = document.getElementById("weatherDetails");
const newsContainer = document.getElementById("news");
const forecastContainer = document.querySelector(".forecast-container");
const userPreferences = document.querySelector(".user-preferences");

const tempUnitCheckbox = document.getElementById("temperatureUnit");
const notificationsCheckbox = document.getElementById("notifications");
const autoRefreshCheckbox = document.getElementById("autoRefresh");

// API Details (Replace with real API keys)
const WEATHER_API_KEY = "c469214db3ece602652f65295590c4ff";
const NEWS_API_KEY = "e3df3859a5394141aa2e6c4e1ab75167";

// Toggle Dark Mode
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Fetch Weather Data
async function fetchWeather(city) {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            weatherDetails.innerHTML = `<p style="color: red;">City not found! Try again.</p>`;
            return;
        }

        const temp = Math.round(data.main.temp);
        const weatherDesc = data.weather[0].description;
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        weatherDetails.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <img src="${icon}" alt="${weatherDesc}">
            <p>${weatherDesc.toUpperCase()}</p>
            <h2>${temp}°C</h2>
        `;

    } catch (error) {
        weatherDetails.innerHTML = `<p style="color: red;">Error fetching weather data.</p>`;
    }
}

// Fetch News Data
async function fetchNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        newsContainer.innerHTML = data.articles.slice(0, 5).map(article => `
            <div class="news-item">
                <h3>${article.title}</h3>
                <p>${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `).join('');
    } catch (error) {
        newsContainer.innerHTML = `<p style="color: red;">Error fetching news.</p>`;
    }
}

// Get User Location & Fetch Weather
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                fetchWeather(data.name);
            } catch (error) {
                weatherDetails.innerHTML = `<p style="color: red;">Error fetching location weather.</p>`;
            }
        });
    } else {
        alert("Geolocation not supported by your browser.");
    }
});

// Refresh Data
refreshBtn.addEventListener("click", () => {
    if (cityInput.value) fetchWeather(cityInput.value);
    fetchNews();
});

// Load Hourly Forecast (Mockup Example)
hourlyForecastBtn.addEventListener("click", () => {
    forecastContainer.innerHTML = `
        <p>📅 9 AM: 25°C ☀️</p>
        <p>📅 12 PM: 28°C ⛅</p>
        <p>📅 3 PM: 27°C 🌤</p>
        <p>📅 6 PM: 24°C 🌙</p>
    `;
    hourlyForecastBtn.innerText = "Forecast Loaded ✅";
});

// Load More News (Mockup Example)
moreNewsBtn.addEventListener("click", () => {
    newsContainer.innerHTML += `
        <div class="news-item"><h3>Extra News 1</h3><p>More content here...</p></div>
        <div class="news-item"><h3>Extra News 2</h3><p>More content here...</p></div>
    `;
});

// Save Preferences
saveBtn.addEventListener("click", () => {
    localStorage.setItem("useFahrenheit", tempUnitCheckbox.checked);
    localStorage.setItem("enableNotifications", notificationsCheckbox.checked);
    localStorage.setItem("autoRefresh", autoRefreshCheckbox.checked);
    alert("Preferences saved!");
});

// Load Preferences on Startup
document.addEventListener("DOMContentLoaded", () => {
    tempUnitCheckbox.checked = localStorage.getItem("useFahrenheit") === "true";
    notificationsCheckbox.checked = localStorage.getItem("enableNotifications") === "true";
    autoRefreshCheckbox.checked = localStorage.getItem("autoRefresh") === "true";

    fetchNews();
});

// Share Dashboard
shareBtn.addEventListener("click", async () => {
    try {
        await navigator.share({
            title: "Weather & News Dashboard",
            url: window.location.href
        });
        alert("Dashboard shared successfully!");
    } catch (error) {
        alert("Sharing failed.");
    }
});

// Toggle Settings Panel
settingsBtn.addEventListener("click", () => {
    userPreferences.classList.toggle("hidden");
});

// Auto-Refresh Feature
if (autoRefreshCheckbox.checked) {
    setInterval(() => {
        if (cityInput.value) fetchWeather(cityInput.value);
        fetchNews();
    }, 30000); // Auto-refresh every 30 seconds
}

// Search Button Action
searchBtn.addEventListener("click", () => {
    fetchWeather(cityInput.value);
});

// Press Enter to Search
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchWeather(cityInput.value);
    }
});
