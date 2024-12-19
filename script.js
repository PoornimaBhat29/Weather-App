const apiKey = 'da7a414a32fe81d7a2933d8386a0f116'; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecastInfo = document.getElementById('forecastInfo'); // For the 5-day forecast

// Function to fetch current weather
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    displayWeather(data);

    // Fetch 5-day forecast after current weather
    getForecast(city);
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
    weatherInfo.style.display = 'block';

    // Hide forecast info on error
    forecastInfo.style.display = 'none';
  }
}

// Function to fetch 5-day forecast
async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    forecastInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
    forecastInfo.style.display = 'none'; 
  }
}

// Function to display current weather
function displayWeather(data) {
  const { name, main, weather, wind, sys, visibility } = data;

  const temperature = main.temp;
  const humidity = main.humidity;
  const pressure = main.pressure;
  const description = weather[0].description;
  const icon = weather[0].icon;
  const windSpeed = wind.speed;
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
  const visibilityKm = (visibility / 1000).toFixed(2);

  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <p><strong>Temperature:</strong> ${temperature}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    <p><strong>Visibility:</strong> ${visibilityKm} km</p>
    <p><strong>Sunrise:</strong> ${sunrise}</p>
    <p><strong>Sunset:</strong> ${sunset}</p>
    <p><strong>Description:</strong> ${description}</p>
  `;

  weatherInfo.style.display = 'block';
}

// Function to display 5-day forecast
function displayForecast(data) {
  const forecasts = data.list; 
  const dailyForecasts = {};

  // Group forecasts by date
  forecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(forecast);
  });

  // Generate HTML for 5-day forecast
  forecastInfo.innerHTML = `<h3>5-Days Forecast</h3>`;
  Object.entries(dailyForecasts).forEach(([date, dayForecasts]) => {
    
    const middayForecast = dayForecasts[Math.floor(dayForecasts.length / 2)];
    const { main, weather } = middayForecast;
    const temp = main.temp;
    const description = weather[0].description;
    const icon = weather[0].icon;

    forecastInfo.innerHTML += `
      <div class="forecast-day">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p><strong>Temp:</strong> ${temp}°C</p>
        <p><strong>${description}</strong></p>
      </div>
    `;
  });

  forecastInfo.style.display = 'block';
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert('Please enter a city name');
  }
});
