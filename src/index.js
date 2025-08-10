// index.js
/* eslint-disable no-param-reassign */
/* eslint-disable no-dupe-keys */
// Update clock and date
// eslint-disable-next-line import/prefer-default-export
import "./styles.css";
import {
  updateTime,
  showLocation,
  showSixDaysForecast,
  showTenHoursForecast,
  showForecastDay,
  createWeatherIconSrc,
  createBodyBackgroundSrc,
  forecastHoursDays,
  forecastAdditionalInfo,
  hideLoader,
  showContent,
  displayLoading,
  hideLoading,
} from "./ui";

import {
  getLocalStorageUnitGroup,
  setLocalStorageUnitGroup,
  setLocalStorageLocation,
  getLocalStorageLocation,
  deleteLocalStorageItem,
  listenToggleBtn,
  capitalize,
} from "./utils";

updateTime();
setInterval(updateTime, 60000); // Update every minute

async function getWeatherInfo(city, unitGroup) {
  displayLoading();
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitGroup}&key=96MD4XDBEYVP6TFJS5JSQ7Y9F&contentType=json`,
      { mode: "cors" },
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const weatherInfo = await response.json();
    const nextSixDays = weatherInfo.days.slice(0, 6);
    const dateTime = weatherInfo.currentConditions.datetime;
    const dateTimeFloat = parseFloat(dateTime.replace(":", "."));
    const timeNowIndex = Math.ceil(dateTimeFloat);
    const hoursToday = nextSixDays[0].hours;
    const hoursTomorrow = nextSixDays[1].hours;
    const finishIndex = timeNowIndex + 10;
    const concatenatedArray = hoursToday.concat(hoursTomorrow);
    const nextTenHrs = concatenatedArray.slice(timeNowIndex, finishIndex);
    const iconName = weatherInfo.currentConditions.icon;

    forecastHoursDays(nextTenHrs, nextSixDays);
    createBodyBackgroundSrc(iconName);
    createWeatherIconSrc(iconName);
    showTenHoursForecast(dateTime);
    showForecastDay();
    showSixDaysForecast();
    showLocation(weatherInfo.address);
    forecastAdditionalInfo(weatherInfo, unitGroup);
    hideLoading();
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
  return null;
}

const requestOptions = {
  method: "GET",
  redirect: "follow",
};
const unitGroupUS = "us";
const unitGroupMetric = "metric";
let unitGroupBool = true;

async function userLocation(localStorageLocation) {
  try {
    const response = await fetch(
      "https://api.ipgeolocation.io/v2/ipgeo?apiKey=d901284ba6224f3682ec05af1d6c6ad3",
      requestOptions,
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const locationInfo = await response.json();
    const location = locationInfo.location.city;

    if (localStorage.getItem("location") !== null) {
      getWeatherInfo(localStorageLocation, getLocalStorageUnitGroup());
      showLocation(localStorageLocation);
    } else {
      getWeatherInfo(location, getLocalStorageUnitGroup());
      setLocalStorageLocation(location);
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
  return null;
}

function getSearchedCityName() {
  const btn = document.querySelector(".search-btn");
  btn.addEventListener("click", () => {
    const cityName = document.getElementById("location-search").value;
    const formElement = document.querySelector(".search-txt");
    formElement.reportValidity();
    if (cityName) {
      getWeatherInfo(capitalize(cityName), getLocalStorageUnitGroup());
      setLocalStorageLocation(cityName);
      document.getElementById("location-search").value = "";
      document.querySelector(".search-txt").value = "";
    }
  });
}
getSearchedCityName();

function toggleUnitGroup() {
  unitGroupBool = !unitGroupBool;

  if (unitGroupBool === false) {
    setLocalStorageUnitGroup(unitGroupUS);
    userLocation(getLocalStorageLocation());
  } else {
    setLocalStorageUnitGroup(unitGroupMetric);
    userLocation(getLocalStorageLocation());
  }
}
// Function to load checkbox states from Local Storage
function loadToggleState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const savedState = getLocalStorageUnitGroup();

  if (savedState === unitGroupUS) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = "false";
      unitGroupBool = false;
    });
  }
}

listenToggleBtn(toggleUnitGroup);

function loadPageContent() {
  window.onload = () => {
    loadToggleState();
    deleteLocalStorageItem("location");
    userLocation(getLocalStorageLocation());
    setTimeout(() => {
      hideLoader();
      showContent();
    }, 1500);
    setTimeout(() => {
      document.getElementById("body").style.display = "";
    }, 200);
  };
}

loadPageContent();

const refreshBtn = document.getElementById("id_block_refresh");

function refresh() {
  refreshBtn.classList.toggle("refresh_animate");
  setTimeout(() => refreshBtn.classList.toggle("refresh_animate"), 2000);
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}
refreshBtn.addEventListener("click", refresh);
