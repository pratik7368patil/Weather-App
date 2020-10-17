// set date on load window

let date = document.getElementById('date');
const sysDate = new Date();
date.innerText = sysDate.toDateString();
// set api with key

const api = {
	key: "b658821324e2db0f3403fab6b15d2e4d",
	url: "https://api.openweathermap.org/data/2.5/weather",
}

// fetching data from api
const getApiData = (city) => {
	fetch(`${api.url}?q=${city}&units=metric&appid=${api.key}`)
	.then(weather => {
		if(weather.ok) {
			return weather.json();
		} else {
			alert('City Not Valid!');
		}
	}).then(displayResults);
}


// input from search box
const getUserInput = (event) => {
	if(event.keyCode === 13) {
		getApiData(event.target.value);
	}
}

// eventlistener to search box
let searchField = document.getElementById('search');
searchField.addEventListener('keypress', (event) => getUserInput(event));



// display api results to UI

const displayResults = (weather) => {

	let temperature = document.getElementById('temperature');
	temperature.innerText = weather.main.temp;

	let tempMin = document.getElementById('temp_min');
	tempMin.innerText = weather.main.temp_min;

	let tempMax = document.getElementById('temp_max');
	tempMax.innerText = weather.main.temp_max;

	let description = document.getElementById('description');
	description.innerText = weather.weather[0].description;

	let main = document.getElementById('main_status');
	main.innerText = weather.weather[0].main;

	let city = document.getElementById('city');
	city.innerText = `${weather.name}, ${weather.sys.country}`;

	let wind = document.getElementById('wind');
	wind.innerText = weather.wind.speed;

	let humidity = document.getElementById('humidity');
	humidity.innerText = weather.main.humidity;

	let feelsLike = document.getElementById('feels_like');
	feelsLike.innerText = weather.main.feels_like;

	let pressure = document.getElementById('pressure');
	pressure.innerText = weather.main.pressure;

}

// showing initial city as london
getApiData('london');