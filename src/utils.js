const unitGroupMetric = "metric";

function handleUnitGroup(unit) {
  const metricTextContent = "kph";
  const milesTextContent = "mph";

  if (unit === "metric") {
    return metricTextContent;
  }
  return milesTextContent;
}

function roundHr(hr) {
  if (hr === undefined) {
    return "NA";
  }
  const roundedHr = hr.slice(0, -3);
  return roundedHr;
}

function getLocalStorageUnitGroup() {
  if (localStorage.getItem("unit") === null) {
    localStorage.setItem("unit", unitGroupMetric);
  }
  const unit = localStorage.getItem("unit") || [];
  return unit;
}

function setLocalStorageUnitGroup(unit) {
  localStorage.setItem("unit", unit);
}
function setLocalStorageLocation(location) {
  const city = location[0].toUpperCase() + location.slice(1);
  localStorage.setItem("location", city);
}

function getLocalStorageLocation() {
  const unit = localStorage.getItem("location") || [];
  return unit;
}

function deleteLocalStorageItem(item) {
  localStorage.removeItem(item);
}

function listenToggleBtn(toggleUnitGroup) {
  const toggleBtn = document.getElementById("button-3");
  toggleBtn.addEventListener("click", toggleUnitGroup);
}

function capitalize(cityName) {
  const capitalized = cityName.split(" ");

  for (let i = 0; i < capitalized.length; i += 1) {
    capitalized[i] = capitalized[i][0].toUpperCase() + capitalized[i].substr(1);
  }
  return capitalized.join(" ");
}

export {
  handleUnitGroup,
  roundHr,
  getLocalStorageUnitGroup,
  setLocalStorageUnitGroup,
  setLocalStorageLocation,
  getLocalStorageLocation,
  deleteLocalStorageItem,
  listenToggleBtn,
  capitalize,
};
