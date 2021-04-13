const generateNewCityCard = (data, id, selectThis) => {
  return `
    <div class="col-md-2 mb-2 default-card unique_${id} ${
    data.city_name.toLowerCase() === selectThis.toLowerCase() ? "active" : ""
  }">
        <h2 class="d-card-head">${data.city_name}</h2>
        <h5>
            <span>${data.temp_min}</span> &#8451; /
            <span>${data.temp_max}</span> &#8451;
        </h5>
        <div class="d-card-end">
            <span class="text-mute" id="today_weather">Today's Weather</span>
            <div class="delete-icon">
            <img src="./images/delete.svg" />
            </div>
        </div>
    </div>`;
};
