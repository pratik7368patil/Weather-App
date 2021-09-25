(function () {
  let LOCATIONS = [{ city_name: "London", temp_min: "", temp_max: "" }];
  const checkLocalData = window.localStorage.getItem("wLocations");

  const updateLocalData = (data) => {
    window.localStorage.setItem("wLocations", JSON.stringify(data));
    LOCATIONS = JSON.parse(window.localStorage.getItem("wLocations"));
  };

  function getActive() {
    let activeLocation = "";
    document.querySelectorAll(".default-card").forEach((item) => {
      if (item.classList.contains("active")) {
        activeLocation = item.querySelector(".d-card-head").innerText.trim();
      }
    });

    return activeLocation;
  }

  const removeLocationCity = (cityName, isSelected) => {
    LOCATIONS = LOCATIONS.filter((location) => location.city_name != cityName);
    updateLocalData(
      LOCATIONS.length > 0
        ? LOCATIONS
        : [{ city_name: "London", temp_min: "", temp_max: "" }]
    );
    if (isSelected) {
      getApiData(LOCATIONS[0].city_name);
    } else {
      updateCardUi(getActive());
    }
  };

  const updateLocations = (cityName) => {
    LOCATIONS.push({ city_name: cityName, temp_min: "", temp_max: "" });
    updateLocalData(LOCATIONS);
    getApiData(cityName);
  };

  const generateID = () => Math.floor(Math.random() * 2983746284);

  let activeLocation = 0;
  const updateLocationTemp = (cityName, temp_min, temp_max) => {
    for (let i = 0; i < LOCATIONS.length; i++) {
      if (LOCATIONS[i].city_name.toLowerCase() === cityName.toLowerCase()) {
        LOCATIONS[i].temp_max = temp_max;
        LOCATIONS[i].temp_min = temp_min;
      }
    }
  };

  function renderNewCity(
    newLocation,
    locationCardParent,
    selectThis = LOCATIONS[0].city_name
  ) {
    let newId = generateID();
    let newLocationCard = generateNewCityCard(
      { ...newLocation },
      newId,
      selectThis
    );
    locationCardParent.innerHTML =
      newLocationCard + locationCardParent.innerHTML;

    setTimeout(() => {
      document
        .querySelector(`.unique_${newId} .delete-icon`)
        .addEventListener("click", (e) => {
          if (LOCATIONS.length > 1) {
            let cityName = newLocation.city_name;
            let ele = document.querySelector(`.unique_${newId}`);
            if (ele.classList.contains("active")) {
              removeLocationCity(cityName, true);
            } else {
              removeLocationCity(cityName, false);
            }
          } else {
            showAlert("Please keep at least one city!", false);
          }
          e.stopPropagation();
        });

      document
        .querySelector(`.unique_${newId}`)
        .addEventListener("click", () => {
          if (getActive() !== newLocation.city_name) {
            document.querySelector(`.unique_${newId}`).classList.add("active");
            getApiData(newLocation.city_name);
          }
        });
    }, 0);
  }

  const updateCardUi = (cityName) => {
    const locationCardParent = document.querySelector("#add-new-weather-city");
    locationCardParent.innerHTML = "";
    for (let i = LOCATIONS.length - 1; i > -1; i--) {
      // update cards;
      renderNewCity(LOCATIONS[i], locationCardParent, cityName);
    }
  };

  const showAlert = (data, status) => {
    var alertEle = document.getElementById("alert_status");
    alertEle.className = `show ${status ? "ok" : "error"}`;

    alertEle.innerText = data;
    setTimeout(function () {
      alertEle.className = alertEle.className.replace("show", "");
    }, 3000);
  };

  // convert unix time into normal time

  const getSunTime = (value) => {
    let time = new Date(value * 1000);
    return `${time.getHours()}:${time.getSeconds()}`;
  };

  // get all ui components

  const giveAllUiComponents = () => ({
    temperature: document.getElementById("temperature"),
    //tempMin: document.getElementById("temp_min"),
    //tempMax: document.getElementById("temp_max"),
    description: document.getElementById("description"),
    main: document.getElementById("main_status"),
    city: document.getElementById("current-city"),
    wind: document.getElementById("wind"),
    humidity: document.getElementById("humidity"),
    feelsLike: document.getElementById("feels_like"),
    pressure: document.getElementById("pressure"),
    visibility: document.getElementById("visibility"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    icon: document.getElementById("icon"),
  });

  const displayResults = (weather) => {
    if (weather && typeof weather !== "string") {
      uiComponents = giveAllUiComponents();

      uiComponents.temperature.innerText = weather.main.temp;
      uiComponents.humidity.innerText = weather.main.humidity;
      uiComponents.feelsLike.innerText = weather.main.feels_like;
      uiComponents.pressure.innerText = weather.main.pressure;
      uiComponents.description.innerText =
        weather.weather[0].description.charAt(0).toUpperCase() +
        weather.weather[0].description.slice(1);
      uiComponents.main.innerText = weather.weather[0].main;
      uiComponents.wind.innerText = weather.wind.speed;
      uiComponents.visibility.innerText = weather.visibility / 1000;
      uiComponents.city.innerText = weather.name;
      uiComponents.sunrise.innerText = getSunTime(weather.sys.sunrise);
      uiComponents.sunset.innerText = getSunTime(weather.sys.sunset);

      uiComponents.icon.innerHTML = `<img src="./images/${weather.weather[0].icon}.svg" height="80px" width="80px" />`;
      updateLocationTemp(
        weather.name,
        weather.main.temp_min,
        weather.main.temp_max
      );
      updateCardUi(weather.name);
    }
  };

  // set api url with key

  const api = {
    key: "b658821324e2db0f3403fab6b15d2e4d",
    url: "https://api.openweathermap.org/data/2.5/weather",
  };

  // fetching data from api
  const getApiData = (city) => {
    fetch(`${api.url}?q=${city}&units=metric&appid=${api.key}`)
      .then((weather) => {
        if (weather.ok) {
          showAlert("Got Your City!", true);
          return weather.json();
        } else {
          removeLocationCity(city);
          showAlert("Oops City Not Found!", false);
        }
      })
      .then((data) => displayResults(data))
      .catch((e) => {
        console.log(e);
      });
  };

  // input from search box
  const getUserInput = (event) => {
    if (event.keyCode === 13) {
      getApiData(event.target.value);
      event.target.value = "";
    }
  };

  // eventlistener to search box
  (function () {
    let searchField = document.getElementById("search");
    searchField.addEventListener("keypress", (event) => getUserInput(event));
  })();

  // Custom Model
  (function () {
    let customModel = document.querySelector(".custom-modal-dialog-container");
    let customModelMain = document.querySelector(".custom-modal-dialog");
    let customModelCancel = document.querySelector(
      ".custom-modal-dialog .cancel"
    );
    let customModelAdd = document.querySelector(".custom-modal-dialog .add");

    let getInput = document.querySelector(
      ".custom-modal-dialog .add-new-field"
    );

    let cityName = "";

    function isExisted(cityName) {
      for (let i = 0; i < LOCATIONS.length; i++) {
        if (LOCATIONS[i].city_name.toLowerCase() === cityName.toLowerCase()) {
          return true;
        }
      }

      return false;
    }
    getInput.addEventListener("change", (e) => {
      cityName = e.target.value.trim();
      e.target.value = "";
    });

    function update(cityName) {
      if (!isExisted(cityName)) {
        updateLocations(cityName);
        customModel.click();
      } else {
        showAlert("City already Exist!", false);
      }
    }

    getInput.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        update(e.target.value);
        e.target.value = "";
      }
    });

    customModelAdd.addEventListener("click", () => {
      update(cityName);
    });

    document.querySelector(".add-new-city").addEventListener("click", () => {
      customModel.classList.remove("hide");
    });

    customModel.addEventListener("click", () => {
      customModel.classList.add("hide");
    });

    customModelMain.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    customModelCancel.addEventListener("click", () => {
      customModel.click();
    });
  })();

  // wish on the basis of time
  // showing initial city as london
  // set date on load window

  (function () {
    const sysDate = new Date();
    currentTime = sysDate.getHours();

    let wish = "";

    if (currentTime >= 0 && currentTime <= 12) {
      wish = "Good Morning!";
    } else if (currentTime >= 12 && currentTime <= 17) {
      wish = "Good Afternoon!";
    } else {
      wish = "Good Evening!";
    }

    let wishEle = document.getElementById("wish");
    wishEle.innerText = wish;

    let date = document.getElementById("date");
    date.innerText = sysDate.toDateString();
  })();

  // start from here
  (function () {
    if (!checkLocalData) {
      updateLocalData(LOCATIONS);
    } else {
      LOCATIONS = JSON.parse(checkLocalData);
    }
    updateCardUi(LOCATIONS[0].city_name);
    getApiData(LOCATIONS[0].city_name);
  })();
})();
