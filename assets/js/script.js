// API
var weatherKey = "ba9a914966ee540c726610644ae08e20";
var url;
var forecastUrl;

// HTML elements so that we can target them through the DOM and manipulate them
var searchForm = document.getElementById("searchForm");
var cityInput = document.getElementById("cityInput");
var cityNameEl = document.getElementById("cityName");
var dateEl = document.getElementById("date");
var weatherIconEl = document.getElementById("weatherIcon");
var temperatureEl = document.getElementById("temperature");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var forecastContainerEl = document.getElementById("forecastContainer");

// SEARCH HISTORY and LOCAL STORAGE

// Users choose what they want, we do not. We will dynamically add to the array
// Empty array because the user inputs their own data.
// The array will always be empty for new users.
var searchHistoryArray = [];
// When a user inputs data in the searchHistoryArray, this variable ⬇️ will obtain the data from the empty array and store it in savedSearchHistory which makes it local storage. That is what the getItem method is doing here.
var savedSearchHistory = localStorage.getItem("searchHistoryArray");
// If there is any data stored in savedSearchHistory (local storage) the data will then be loaded for the user and will not go away. JSON.parse is making it readable text.
if (savedSearchHistory) {
  // Once there is input stored in searchHistoryArray, it will be displayed for the user.
  searchHistoryArray = JSON.parse(savedSearchHistory);
  displaySearchHistory();
}

// Event Listener for the search form. When clicking submit on the submit button.
searchForm.addEventListener("submit", formSubmit);

// function for getting the current date from the dayjs API.
function getCurrentDate() {
  return dayjs().format("DD/MM/YYYY");
}

// GET WEATHER DATA
function fetchWeatherData(city) {
  // API for the openweathermap API
  // Template literal
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherKey}`;

  // API call from the openweathermap API. current weather
  fetch(weatherUrl)
    // getting a response from the api and returning it into a JSON which is a readable text.
    .then(function (response) {
      return response.json();
    })
    // logs the data pulled from the api as a JSON.
    .then(function (weatherData) {
      console.log(weatherData);

      // clear current weather data
      // Will get reset every time a new city is searched
      cityNameEl.innerText = "";
      dateEl.innerText = "";
      weatherIconEl.innerText = "";
      temperatureEl.innerText = "";
      humidityEl.innerText = "";
      windSpeedEl.innerText = "";

      // rewrite information for new city that is searched
      cityNameEl.innerText = weatherData.name;
      dateEl.innerText = getCurrentDate();
      weatherIconEl.innerHTML = `<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">`;
      temperatureEl.textContent = "Temp: " + weatherData.main.temp + "°F";
      humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";
      windSpeedEl.textContent = "Wind: " + weatherData.wind.speed + "MPH";

      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherKey}`;

      fetchForecastData(forecastUrl);
      addToSearchHistory(city);
    });
}

function addToSearchHistory(city) {
  if (!searchHistoryArray.includes(city)) {
    searchHistoryArray.push(city);
    localStorage.setItem(
      "searchHistoryArray",
      JSON.stringify(searchHistoryArray)
    );
    displaySearchHistory();
  }
}

// 5 day forecast
function fetchForecastData(url) {
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (forecastData) {
      forecastContainerEl.innerHTML = "";
      var forecastEntries = forecastData.list;
      var nextFiveDays = [];
      var forecastDates = [];
      for (var i = 0; i < forecastEntries.length; i++) {
        var forecastDateTime = forecastEntries[i].dt_txt;
        var forecastDate = forecastDateTime.split(" ")[0];
        if (
          !forecastDates.includes(forecastDate) &&
          forecastDateTime.includes("12:00:00")
        ) {
          forecastDates.push(forecastDate);
          var forecastItem = {
            date: dayjs(forecastDateTime).format("DD/MM/YYYY"),
            icon: forecastEntries[i].weather[0].icon,
            temperature: forecastEntries[i].main.temp,
            windSpeed: forecastEntries[i].wind.speed,
            humidity: forecastEntries[i].main.humidity,
          };
          nextFiveDays.push(forecastItem);
        }
        if (forecastDates.length === 5) {
          break;
        }
      }
      nextFiveDays.forEach(function (forecastEntry) {
        var forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
                  <div>Date: ${forecastEntry.date}</div>
                  <div><img src="https://openweathermap.org/img/w/${forecastEntry.icon}.png" alt="Weather Icon"></div>
                  <div>Temperature: ${forecastEntry.temperature}°F</div>
                  <div>Wind Speed: ${forecastEntry.windSpeed} mph</div>
                  <div>Humidity: ${forecastEntry.humidity}%</div>`;
        forecastContainerEl.appendChild(forecastItem);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function formSubmit(event) {
  event.preventDefault();

  var city = cityInput.value.trim();

  if (city !== "") {
    fetchWeatherData(city);
  }
}

function displaySearchHistory() {
  var searchHistoryElement = document.getElementById("searchHistory");
  searchHistoryElement.innerHTML = "";

  for (var i = 0; i < searchHistoryArray.length; i++) {
    var city = searchHistoryArray[i];
    var cityItem = document.createElement("div");
    cityItem.innerText = city;
    cityItem.classList.add("city-item");
    cityItem.addEventListener("click", function () {
      fetchWeatherData(this.innerText);
    });
    searchHistoryElement.appendChild(cityItem);
  }
}
