const generateNewCityCard = (data, id, selectThis) => {
  return `
    <div class="col-md-2 mb-2 default-card unique_${id} ${
    data.city_name.toLowerCase() === selectThis.toLowerCase() ? "active" : ""
  }">
        <div class="d-card-end">
            <span class="d-card-head">${data.city_name}</span>
            <div class="delete-icon">
              <img src="./images/delete.svg" />
            </div>
        </div>
    </div>`;
};
