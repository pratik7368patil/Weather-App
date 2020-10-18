const showAlert = (data, status) => {
	var alertEle = document.getElementById("alert_status");
	alertEle.className = `show ${status ? 'ok' : 'error'}`;

	alertEle.innerText = data;
	setTimeout(function(){ alertEle.className = alertEle.className.replace("show", ""); }, 3000);
}

// set api url with key

const api = {
	key: "b658821324e2db0f3403fab6b15d2e4d",
	url: "https://api.openweathermap.org/data/2.5/weather",
}

// fetching data from api
const getApiData = (city) => {
	fetch(`${api.url}?q=${city}&units=metric&appid=${api.key}`)
	.then(weather => {
		if(weather.ok) {
			showAlert('Got Your City!', true);
			return weather.json();
		} else {
			showAlert('Oops Not Found!', false);
		}
	}).then(displayResults);
}


// input from search box
const getUserInput = (event) => {
	if(event.keyCode === 13) {
		getApiData(event.target.value);
	}
}

// convert unix time into normal time

const getSunTime = (value) => {
	let time = new Date(value * 1000);
	return `${time.getHours()}:${time.getSeconds()}`;
}

// get all ui components

const giveAllUiComponents = () => (
	{
		temperature : document.getElementById('temperature'),
		tempMin : document.getElementById('temp_min'),
		tempMax : document.getElementById('temp_max'),
		description : document.getElementById('description'),
		main : document.getElementById('main_status'),
		city : document.getElementById('city'),
		wind : document.getElementById('wind'),
		humidity : document.getElementById('humidity'),
		feelsLike : document.getElementById('feels_like'),
		pressure : document.getElementById('pressure'),
		visibility: document.getElementById('visibility'),
		sunrise: document.getElementById('sunrise'),
		sunset: document.getElementById('sunset'),
		icon : document.getElementById('icon')
	}
);

// display api results to UI

const displayResults = (weather) => {
	
	uiComponents = giveAllUiComponents();

	uiComponents.temperature.innerText = weather.main.temp;	
	uiComponents.tempMin.innerText = weather.main.temp_min;
	uiComponents.tempMax.innerText = weather.main.temp_max;
	uiComponents.humidity.innerText = weather.main.humidity;
	uiComponents.feelsLike.innerText = weather.main.feels_like;
	uiComponents.pressure.innerText = weather.main.pressure;
	uiComponents.description.innerText = weather.weather[0].description;
	uiComponents.main.innerText = weather.weather[0].main;
	uiComponents.city.innerText = `${weather.name}, ${weather.sys.country}`;
	uiComponents.wind.innerText = weather.wind.speed;
	uiComponents.visibility.innerText = weather.visibility / 1000;

	uiComponents.sunrise.innerText = getSunTime(weather.sys.sunrise);
	uiComponents.sunset.innerText = getSunTime(weather.sys.sunset);

	uiComponents.icon.innerHTML = `<img src="./images/${weather.weather[0].icon}.svg" height="80px" width="80px" />`;

}

// eventlistener to search box
(function() {
	let searchField = document.getElementById('search');
	searchField.addEventListener('keypress', (event) => getUserInput(event));
})();

// wish on the basis of time 
// showing initial city as london
// set date on load window

(function() {
	const sysDate = new Date();
	currentTime = sysDate.getHours();

	let wish = '';

	if(currentTime >= 0 && currentTime <= 12) {
		wish = 'Good Morning!';
	} else if(currentTime >= 12 && currentTime <= 17) {
		wish = 'Good Afternoon!';
	} else {
		wish = 'Good Evening!';
	}

	let wishEle = document.getElementById('wish');
	wishEle.innerText = wish;

	let date = document.getElementById('date');
	date.innerText = sysDate.toDateString();
	getApiData('london');
})();