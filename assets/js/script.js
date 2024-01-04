// will collect data from the input field
function GetInfo() {
  var newName = document.getElementById("cityInput");
  var cityName = document.getElementById("cityName")
  cityName.innerHTML = " " + newName.value + " "

fetch("https://api.openweathermap.org/data/2.5/forecast?q='+newName.value+'&appid=ba9a914966ee540c726610644ae08e20")
.then(response => response.json())
.then(data => {
  for(i = 0; i < 5; i++) {
    document.getElementById("day" + (i+1)+"Temp").innerHTML ="Temp:" + Number(data.list[i].main.temp -281.43).toFixed(1)+"°C";
  }
  for(i = 0; i < 5; i++) {
    document.getElementById("day" + (i+1)+"Wind").innerHTML ="Wind:" + Number(data.list[i].wind.speed -4.6).toFixed(1)+"KMPH";
  }
  for(i = 0; i < 5; i++) {
    document.getElementById("day" + (i+1)+"Humidity").innerHTML ="Humidity:" + Number(data.list[i].main.humidity -81).toFixed(1)+"%";
  }
  for(i = 0; i < 5; i++) {
    document.getElementById("img" +(i+1)).src=" https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon+".png";
  }
})

.catch(err => alert("Something Went Wrong"))
}

var d = new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function CheckDay(day) {
  if(day +)
}