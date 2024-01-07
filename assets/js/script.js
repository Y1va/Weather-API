// API
var weatherKey = "ba9a914966ee540c726610644ae08e20"
var url;
var forecastUrl;

// HTML elements
var searchForm = document.getElementById("searchForm");
var cityInput = document.getElementById("cityInput");
var cityNameEl = document.getElementById("cityName");
var dateEl = document.getElementById("date");
var weatherIconEl = document.getElementById("weatherIcon");
var temperatureEl = document.getElementById("temperature");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var forecastContainerEl = document.getElementById("forecastContainer");

// SEARCH HISTORY 
// They choose what they want, we do not. We will dynamically add to the array
var searchHistoryArray = [];
var savedSearchHistory = localStorage.getItem("searchHistoryArray");
if (savedSearchHistory) {
  searchHistoryArray = JSON.parse(savedSearchHistory);
  displaySearchHistory();
}

searchForm.addEventListener("submit", formSubmit);

function getCurrentDate() {
  return dayjs().format("DD/MM/YYYY");
}