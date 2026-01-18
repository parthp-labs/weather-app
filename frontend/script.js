const userLocation = document.querySelectorAll(".location");
const currentTime = document.getElementById("current-time");
const currentDate = document.getElementById("current-date");

const toggleCelsius = document.getElementById("celsius-unit");
const toggleFahrenheit = document.getElementById("fahrenheit-unit");
const toggleToday = document.getElementById("hourly");
const toggleWeekly = document.getElementById("weekly");

const currentCondition = document.getElementById("current-condition");
const currentPrecip = document.getElementById("current-precip");
const currentWindSpeed = document.getElementById("current-wind-speed");
const currentHumidity = document.getElementById("current-humidity");
const currentTemperature = document.getElementById("current-temperature");
const currentTemperatureIcon = document.getElementById(
  "current-temperature-icon",
);

const maxTemperature = document.getElementById("max-temperature");
const minTemperature = document.getElementById("min-temperature");
const feelsLike = document.getElementById("feels-like");
const airQuality = document.getElementById("air-quality");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const uvIndex = document.getElementById("uv-index");
const airQualityStatus = document.getElementById("air-quality-status");
const uvIndexStatus = document.getElementById("uv-index-status");

const searchForm = document.getElementById("search-form");
const userLocBtn = document.getElementById("user-loc-weather-btn");

const backdrop = document.getElementById("backdrop");
const backdropMsgText = document.getElementById("backdrop-msg-text");

const highlightsTitle = document.getElementById("highlights-title");

const weatherCardsContainer = document.getElementById("weather-cards");

let userSelectedLoc = false;

const unit = "c";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let weeklyOrHourly = "hourly";

// Attaching Event Listeners
toggleCelsius.addEventListener("click", toggleUnit);
toggleFahrenheit.addEventListener("click", toggleUnit);
toggleToday.addEventListener("click", () => {
  togglePeriod("hourly");
});
toggleWeekly.addEventListener("click", () => {
  togglePeriod("weekly");
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = document.getElementById("search-field");

  userSelectedLoc = query.value;
  getWeatherData(query.value);
});
userLocBtn.addEventListener("click", () => {
  getLocation();
  userSelectedLoc = false;
});

// Initially calling getLocation() function to get location and then weather data of the current user location
getLocation();

// Updating the datetime continuously after 1 sec interval
setInterval(() => {
  getDateTime();
}, 1000);

// Function for updating the date time
function getDateTime() {
  const now = new Date();
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  // Forming the date string
  const dateString = `${day}, ${date} ${month} ${year}`;

  currentTime.innerHTML = convertTo12Hour(now.toTimeString());
  currentDate.innerHTML = dateString;
}

// Function for toggling the unit
function toggleUnit() {
  const temperatureValues = document.querySelectorAll(".temp-value");
  const temperatureUnits = document.querySelectorAll(".temp-unit");

  // Making the selected item active
  if (toggleCelsius.classList.contains("active")) {
    toggleCelsius.classList.remove("active");
    toggleFahrenheit.classList.add("active");

    // Updating the value text element in Celsius to Fahrenheit
    temperatureValues.forEach((value) => {
      const valToFahrenheit = (
        (parseFloat(value.innerHTML) * 9) / 5 +
        32
      ).toFixed(1);
      value.innerHTML = valToFahrenheit;
    });

    // Updating the units text element to °F
    temperatureUnits.forEach((value) => {
      value.innerHTML = "°F";
    });
  } else {
    toggleCelsius.classList.add("active");
    toggleFahrenheit.classList.remove("active");

    // Updating the value text element in Fahrenheit to Celsius
    temperatureValues.forEach((value) => {
      const valToFahrenheit = (
        ((parseInt(value.innerHTML) - 32) * 5) /
        9
      ).toFixed(1);
      value.innerHTML = valToFahrenheit;
    });

    // Updating the units text element to °C
    temperatureUnits.forEach((value) => {
      value.innerHTML = "°C";
    });
  }
}

// Function for toggling the period
function togglePeriod(period) {
  if (period == "weekly") {
    toggleToday.classList.remove("active");
    toggleWeekly.classList.add("active");
    weeklyOrHourly = "weekly";
  } else if (period == "hourly") {
    weeklyOrHourly = "hourly";
    toggleToday.classList.add("active");
    toggleWeekly.classList.remove("active");
  }

  // Checking if user wants results for a particular location else using getting the weather data of the user's current location
  if (userSelectedLoc) {
    getWeatherData(userSelectedLoc);
  } else {
    getLocation();
  }
}

// Function for updating current weather
function updateWeather(weatherData) {
  // Updating the current weather related data
  currentTemperature.innerHTML = weatherData.currentConditions.temp;
  currentCondition.innerHTML = weatherData.currentConditions.conditions;
  currentWindSpeed.innerHTML =
    weatherData.currentConditions.windspeed + " km/h";
  currentHumidity.innerHTML = weatherData.currentConditions.humidity + "%";
  currentPrecip.innerHTML = (weatherData.currentConditions.precip || 0) + " mm";

  const currentConditions = weatherData.currentConditions;
  uvIndex.innerHTML = currentConditions.uvindex;
  maxTemperature.innerHTML = weatherData.days[0].tempmax;
  minTemperature.innerHTML = weatherData.days[0].tempmin;
  feelsLike.innerHTML = currentConditions.feelslike;
  airQuality.innerHTML = currentConditions.winddir;

  getUVIndexStatus(currentConditions.uvindex);
  getAirQualityStatus(currentConditions.winddir);

  const sunriseTime = new Date(currentConditions.sunrise);
  sunrise.innerHTML = convertTo12Hour(currentConditions.sunrise);
  sunset.innerHTML = convertTo12Hour(currentConditions.sunset);

  // Adding the weather icon based on conditions
  const weatherIcon = getWeatherIcon(weatherData.currentConditions.icon);
  currentTemperatureIcon.innerHTML = `<dotlottie-player
                                          src="${weatherIcon}"
                                          background="transparent"
                                          speed="0.4"
                                          style="width: 200px; height: 200px"
                                          loop
                                          autoplay
                                        ></dotlottie-player>`;
}

// Function for converting time into 12 hour format
function convertTo12Hour(datetime) {
  const forecastTime = datetime.slice(0, 5);

  let hours = parseInt(forecastTime.slice(0, 2));
  let minutes = parseInt(forecastTime.slice(3, 5));
  let abbreviation = "";

  // Checking for AM or PM
  if (hours > 12) {
    hours = hours - 12;
    abbreviation = "PM";
  } else {
    abbreviation = "AM";
  }

  // Returning the time in 12 hour format
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${abbreviation}`;
}

// Function for getting the user's current location
function getLocation() {
  showLoader(true, "Getting Weather Data");

  fetch("https://geolocation-db.com/json/", { method: "GET", headers: {} })
    .then((response) => response.json())
    .then((data) => {
      const city = data.city;

      // Calling getWeatherData() function to get the weather data of users's current location
      getWeatherData(city);
    })
    .finally(() => {
      showLoader(false, "");
    })
    .catch((error) => {
      getLocation();
    });
}

// Function for getting weather data
function getWeatherData(city) {
  showLoader(
    true,
    `Getting Weather & Forecast for <br> ${city.replace(
      city[0],
      city[0].toUpperCase(),
    )}`,
  );

  // Making GET request to get the weather data of required city
  fetch(`/api/weather?city=${city}`, { method: "GET", headers: {} })
    .then((response) => response.json())
    .then((data) => {
      // Updating the elements with the user's location
      userLocation.forEach((elem) => {
        elem.innerHTML = data.resolvedAddress;
      });

      // Calling updateWeather() function to show the data by updating elements
      updateWeather(data);

      // Calling populateWeatherCard() function to populate the container with data based on hourly or weekly
      populateWeatherCards(data);
    })
    .catch((error) => {
      getWeatherData(city);
    })
    .finally(() => {
      showLoader(false, "");
    });
}

// Function for getting weather icon
function getWeatherIcon(condition) {
  let src = "";

  // Checking for the weather condition
  condition = condition && condition.toLowerCase();
  if (condition == "overcast") {
    src =
      "https://lottie.host/3cb3992b-fcfd-417d-8ef6-4d8fb05ab7df/eTxzsJSzn3.json";
  } else if (condition == "rain") {
    src =
      "https://lottie.host/54a95fd3-fd1e-4aa7-a0cd-e92a867d2fcb/Yq69f04NAC.json";
  } else if (condition == "partly-cloudy-day" || condition == "cloudy") {
    src =
      "https://lottie.host/ebbabe61-4b10-4add-874c-2d51078c63a2/ylHTCiyrll.json";
  } else if (condition == "clear-day") {
    src =
      "https://lottie.host/f7218870-bb26-4f8f-9466-a3f72df34d1c/Gw1AvREBR1.json";
  } else if (condition == "clear-night" || condition == "partly-cloudy-night") {
    src =
      "https://lottie.host/580a5b3e-3a14-4a5b-a247-35066b7bd76a/XiNzC1YQgb.json";
  }

  return src;
}

// Function for populating the weather cards container
function populateWeatherCards(weatherData) {
  // Emptying the container before repopulating to avoid unnecessary data
  weatherCardsContainer.innerHTML = "";

  // Checking if hourly or weekly forecast is required
  let forecastData = weatherData.days;
  if (weeklyOrHourly == "hourly") {
    const currentDayForecast = weatherData.days[0].hours;
    forecastData = currentDayForecast;
  }

  // Iterating through each forecast value
  forecastData.forEach((value) => {
    let timeTag;

    if (weeklyOrHourly == "hourly") {
      const forecastTime = value.datetime.slice(0, 5);

      let hours = parseInt(forecastTime.slice(0, 2));
      let minutes = parseInt(forecastTime.slice(3, 5));
      let abbreviation = "";

      if (hours > 12) {
        hours = hours - 12;
        abbreviation = "PM";
      } else {
        abbreviation = "AM";
      }

      timeTag = convertTo12Hour(value.datetime);
    } else {
      timeTag = days[new Date(value.datetime).getDay()];
    }

    const icon = getWeatherIcon(value.icon);
    const temperature = value.temp;

    // Creating a new div element with required classes and adding it in cards container
    const card = document.createElement("div");
    card.classList.add("weather-card");

    card.innerHTML = ` 
          <h4 class="day">${timeTag}</h4>
          <div class="weather-icon">
          <dotlottie-player
          src="${icon}"
          background="transparent"
          speed="0.4"
          style="width: inherit; height: inherit"
          loop
          autoplay
        ></dotlottie-player>
          </div>
          <div class="weather-card-temp">
            <h4 class="temp-value">${temperature}</h4>
            <span class="temp-unit">°C</span>
          </div>`;

    weatherCardsContainer.appendChild(card);
  });
}

// Function for showing or hiding the loader when data is being received
function showLoader(show, msg) {
  if (show) {
    backdrop.style.display = "flex";
    backdropMsgText.innerHTML = msg;
    document.body.style.overflow = "hidden";
  } else {
    backdrop.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Function for getting air quality status
function getAirQualityStatus(airquality) {
  if (airquality <= 50) {
    airQualityStatus.innerText = "Good👌";
  } else if (airquality <= 100) {
    airQualityStatus.innerText = "Moderate😐";
  } else if (airquality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
  } else if (airquality <= 200) {
    airQualityStatus.innerText = "Unhealthy😷";
  } else if (airquality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy😨";
  } else {
    airQualityStatus.innerText = "Hazardous😱";
  }
}

// Function for getting uv index status
function getUVIndexStatus(uvindex) {
  if (uvindex <= 2) {
    uvIndexStatus.innerText = "Low";
  } else if (uvindex <= 5) {
    uvIndexStatus.innerText = "Moderate";
  } else if (uvindex <= 7) {
    uvIndexStatus.innerText = "High";
  } else if (uvindex <= 10) {
    uvIndexStatus.innerText = "Very High";
  } else {
    uvIndexStatus.innerText = "Extreme";
  }
}
