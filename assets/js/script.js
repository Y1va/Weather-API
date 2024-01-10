// API
var weatherKey = "ba9a914966ee540c726610644ae08e20"
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
var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherKey}`


// API call from the openweathermap API. current weather
fetch(weatherUrl)
// getting a response from the api and returning it into a JSON which is a readable text.
.then(function(response){
  return response.json();
})
// logs the data pulled from the api as a JSON.
.then(function(weatherData){
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
weatherIconEl.innerText = `<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">`;
temperatureEl.textContent = "Temp: " + weatherData.main.temp + "°F";
humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";
windSpeedEl.textContent = "Wind: " + weatherData.wind.speed + "MPH";

forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherKey}`;


fetchForecastData(forecastUrl);
addToSearchHistory(city);
})

}

function addToSearchHistory(city) {
  if(!searchHistoryArray.includes(city)) {
    searchHistoryArray.push(city);
    localStorage.setItem("searchHistoryArray", JSON.stringify(searchHistoryArray));
    displaySearchHistory();
  }
}

// 5 day forecast
function fetchForecastData(Url) {
  fetch(Url)
  .then(function(response){
    return response.json();
  })

  .then(function(forecastData){
    // console.log(forecastData);
    forecastContainerEl.innerHTML = "";
    var forecastEntries = forecastData.list;
    var nextFiveDays = [];
    var currentDate = dayjs().format("YYYY-MM-DD");
    var forecastDates = [];

    for(var i = 0; i < 6; i++) {
      var nextDate = dayjs(currentDate).add(i + 1, "day").format("YYYY-MM-DD");
      forecastDates.push(nextDate);
    }

    forecastEntries.forEach(function(forecastEntry){
      var forecastDateTime = forecastEntry.dt_txt
      var forecastDate = forecastDateTime.split(" ")[0];
      if(forecastDates.includes(forecastDate) && forecastDateTime.includes("12:00:00")) {
        var forecastItem = {
          date: dayjs(forecastDateTime).format("DD/MM/YYYY"),
          icon: forecastEntry.weather[0].icon,
          temperature: forecastEntry.main.temp,
          windSpeed: forecastEntry.wind.speed,
          humidity: forecastEntry.main.humidity,
        };
        nextFiveDays.push(forecastItem);
      }
    })

    nextFiveDays.forEach(function(forecastEntry){
      var forecastElement = document.createElement("div");
      forecastElement.className = "forecast-item";
      forecastElement.innerHTML = `
      <div>${forecastEntry.date}</div>
      <div><img src="https://openweathermap.org/img/w/${forecastEntry.icon}.png" alt="Weather Icon"></div>
      <div>Temperature: ${forecastEntry.temperature}°F</div>
      <div>Wind Speed: ${forecastEntry.windSpeed} mph</div>
      <div>Humidity: ${forecastEntry.humidity}%</div>`;
      
      // append means connect to/bridge between
      forecastContainerEl.appendChild(forecastElement);

    })



  })
}