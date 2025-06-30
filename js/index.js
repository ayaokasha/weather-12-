//api data
const API_KEY = "f2c6e6f7ccb04108b92120818252906";
const FORECAST_API_URL = "https://api.weatherapi.com/v1/forecast.json";

//requesting data
async function fetchWeather(location = "cairo") {
  const container = document.getElementById("weatherContainer");
  const refreshBtn = document.getElementById("refreshBtn");

  container.classList.add("loading");
  refreshBtn.style.animation = "spin 1s linear infinite";

  try {
    const response = await fetch(
      `${FORECAST_API_URL}?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`
    );
    const data = await response.json();

    if (response.ok) {
      updateLocationInfo(data.location);
      updateWeatherCards(data);
    } else {
      throw new Error(data.error?.message || "Failed to fetch weather data");
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Failed to fetch weather data. Please try again.");
  } finally {
    container.classList.remove("loading");
    refreshBtn.style.animation = "";
  }
}
//updating data
function updateLocationInfo(location) {
  document.getElementById("locationName").textContent = location.name;
  document.getElementById(
    "locationDetails"
  ).textContent = `${location.region}, ${location.country}`;
  document.getElementById(
    "currentTime"
  ).textContent = `Local time: ${location.localtime}`;
}
//displaying data
function updateWeatherCards(data) {
  const container = document.getElementById("daysContainer");
  container.innerHTML = "";

  data.forecast.forecastday.forEach((day, index) => {
    const date = new Date(day.date);
    const isToday = index === 0;

    // For today, use current weather data if available

    const currentTemp =
  isToday && data.current
    ? Math.round(data.current.temp_c)
    : Math.round(day.day.maxtemp_c);

    const dayName = isToday
      ? "Today"
      : index === 1
      ? "Tomorrow"
      : date.toLocaleDateString("en", { weekday: "long" });

    const dayCard = document.createElement("div");
    dayCard.className = `day-card ${isToday ? "today" : ""}`;

    // Use current data for today if available, otherwise use forecast
    const iconSrc =
      isToday && data.current
        ? `https:${data.current.condition.icon}`
        : `https:${day.day.condition.icon}`;

    const conditionText =
      isToday && data.current
        ? data.current.condition.text
        : day.day.condition.text;

    const humidity =
      isToday && data.current ? data.current.humidity : day.day.avghumidity;

    const windSpeed =
      isToday && data.current ? data.current.wind_kph : day.day.maxwind_kph;

    dayCard.innerHTML = `
            <div class="day-header">
                <div class="day-name">${dayName}</div>
                <div class="day-date">${date.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                })}</div>
            </div>
            
            <div class="weather-main">
                <div class="weather-icon-container">
                    <img class="weather-icon" src="${iconSrc}" alt="${conditionText}">
                </div>
                <div class="temp-section">
                    <div class="current-temp">${currentTemp}°</div>
                    <div class="temp-range">${Math.round(
                      day.day.mintemp_c
                    )}° - ${Math.round(day.day.maxtemp_c)}°</div>
                </div>
            </div>

            <div class="condition-text">${conditionText}</div>

            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-icon"><img width="80" height="80" src="https://img.icons8.com/arcade/64/wind.png" alt="wind"/></div>
                    <div class="detail-value">${Math.round(
                      windSpeed
                    )} km/h</div>
                    <div class="detail-label">Wind</div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon"><img width="80" height="80" src="https://img.icons8.com/external-justicon-lineal-color-justicon/64/external-humidity-weather-justicon-lineal-color-justicon-1.png" alt="external-humidity-weather-justicon-lineal-color-justicon-1"/></div>
                    <div class="detail-value">${Math.round(humidity)}%</div>
                    <div class="detail-label">Humidity</div>
                </div>
            </div>

        `;

    container.appendChild(dayCard);
  });
}

//search by location
function handleSearch() {
  const input = document.getElementById("locationInput");
  const location = input.value.trim();

  if (location) {
    fetchWeather(location);
  } else {
    alert("Please enter a location.");
  }
}

// Add spin animation for refresh button
const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Load weather data on page load
fetchWeather();


