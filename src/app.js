function addZeroToTime(str) {
  if (str < 10) {
    return `0${str}`;
  } else {
    return str;
  }
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = addZeroToTime(date.getHours());
  let minutes = addZeroToTime(date.getMinutes());
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function getForecast(coordinates) {
  let apiKey = "69a8934df3c12df0dc3ffddf1977ee44";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${tempUnits}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "69a8934df3c12df0dc3ffddf1977ee44";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempUnits}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  cityGlobal = cityInputElement.value;
  search(cityGlobal);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  if (!(fahrenheitLink.classList.contains("active"))) {
    // console.log(this.classList.value);
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    tempUnits = "imperial";
    search(cityGlobal);
    let windUnitsElement = document.querySelector("#wind-units");
    windUnitsElement.innerHTML = "mph";
  }
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  if (!(celsiusLink.classList.contains("active"))) {
    // console.log(this.classList.value);
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    tempUnits = "metric";
    search(cityGlobal);
    let windUnitsElement = document.querySelector("#wind-units");
    windUnitsElement.innerHTML = "m/s";
  }
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="" width="42" />
        <div class="forecast-temperatures">
          <span class="temperature-max">${Math.round(
            forecastDay.temp.max
          )}°</span>
          <span class="temperature-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </div>
      </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Initial values
let tempUnits = "metric";
let cityGlobal = "London";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahr-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search(cityGlobal);
