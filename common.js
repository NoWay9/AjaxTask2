var cityname = null;
var time = moment();
var lat = 49.826676;
var lng = 24.012978;
var key = 'AIzaSyBTPpQ08GB1OGiE1iMkY_e7wqBAHeVEock&libraries';
var darksky_key = '006b905ceffb43135179e0f71c6b339c';
addEventListener('load', position);
function position() {
  getLocation(key, lat, lng)
  addScriptForDarksky(lat, lng, time, darksky_key);
  document.getElementsByClassName('currentTime')[0].innerText = time.format('LT');
}

function getLocation(key, lat, lng) {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + key;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  var response = JSON.parse(xhr.responseText);
  for (let i = 0; i < response.results[0].address_components.length; i++) {
    if (response.results[0].address_components[i].types.indexOf('locality') != -1) {
      cityname = response.results[0].address_components[i].short_name;
      updateInfo(cityname);
      break;
    }
  }

}
function addScriptForDarksky(lat, lng, time, weather_key) {
  var weatherUrl = 'https://api.darksky.net/forecast/' + weather_key + '/' + lat + ',' + lng + ',' + Math.floor(time.valueOf() / 1000) + '?units=si&lang=uk&exclude=hourly,flags,currently' + '&callback=getWeatherJSONP';
  var $script = document.createElement('script');
  $script.src = weatherUrl;
  document.body.appendChild($script);
}

function getWeatherJSONP(e) {
  updateWidget(e); console.log(e);
}

function updateWidget(response) {
  var dailyWeather = response.daily.data[0];
  var datetime = moment(dailyWeather.time * 1000);
  document.getElementsByClassName('currentDate')[0].innerText = datetime.format('L');
  document.getElementsByClassName('minTemperature')[0].innerHTML = "Min: " + dailyWeather.temperatureLow + '&deg;';
  document.getElementsByClassName('maxTemperature')[0].innerHTML = "Max: " + dailyWeather.temperatureMax + '&deg;';
}

function updateInfo(city) {
  document.querySelector('h1').innerText = city;
}

function nextDay() {
  var $nextBtn = document.getElementsByClassName('btn btn-primary next')[0];
  time = time.add(1, 'days');
  addScriptForDarksky(lat, lng, time, darksky_key);
}


function lastDay() {
  time = time.subtract(1, 'days');
  addScriptForDarksky(lat, lng, time, darksky_key);
  if (moment() >= time) {
    var $nextBtn = document.getElementsByClassName('btn btn-primary next')[0];
    $nextBtn.classList.remove('hidden');
  }
}
