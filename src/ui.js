import { handleUnitGroup, roundHr } from "./utils.js";
import defaultRainIcon from "./asset/rain.svg";
/* eslint-disable no-param-reassign */
/* eslint-disable no-dupe-keys */

// eslint-disable-next-line import/prefer-default-export
function updateTime() {
  const now = new Date();

  // Clock
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  document.getElementById("clock").textContent = `${hours}:${minutes}`;

  // Date
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();

  document.getElementById("date").textContent = `${day}, ${month} ${date}`;
}
function showLocation(location) {
  document.querySelector(".location").textContent = location;
  // window.history.pushState({}, "", "/");
}

function showDefaultIcons() {
  const forecastDayNodelist = document.querySelectorAll(".forecast-day-icons");
  const forecastHourNodelist = document.querySelectorAll(
    ".forecast-hour-icons"
  );

  forecastDayNodelist.forEach((img) => {
    img.src = defaultRainIcon;
  });

  forecastHourNodelist.forEach((img) => {
    img.src = defaultRainIcon;
  });
}

function showSixDaysForecast() {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  const forecastDays = document.querySelectorAll(".forecast-days");
  for (let i = 0; i < 6; i += 1) {
    const thisDay = new Date(today);
    thisDay.setDate(today.getDate() + i);
    forecastDays[i].textContent = new Intl.DateTimeFormat(
      "en-US",
      options
    ).format(thisDay);
  }
}

function showTenHoursForecast(timeString) {
  const hours = [];
  const timeOptions = {
    hour12: false,

    hour: "2-digit",
  };
  const today = new Date(`01/01/2025 ${timeString}`);

  today.setMinutes(30);
  const forecastHour = document.querySelectorAll(".forecast-hour");
  for (let i = 0; i < 10; i += 1) {
    const thisDay = new Date(today);

    thisDay.setHours(today.getHours() + 1 + i);

    const tenHours = new Intl.DateTimeFormat("en-US", timeOptions).format(
      thisDay
    );
    hours.push(tenHours);
  }
  forecastHour.forEach((el, i) => {
    el.textContent = `${hours[i]}:00`;
  });
}

function showForecastDay() {
  const forecastHours = document.querySelectorAll(".forecast-hour");
  const forecastDayElements = document.querySelectorAll(".forecast-day");
  let day = "Today";
  let prevHour = null;

  forecastHours.forEach((el, i) => {
    const text = el.textContent.trim(); // e.g., "00:00"
    const forecastHour = parseInt(text.split(":")[0], 10); // extract hour part

    // Detect day rollover: e.g., from 23 to 0
    if (prevHour !== null && forecastHour < prevHour) {
      day = "Tomorrow";
    }
    forecastDayElements[i].textContent = day;
    prevHour = forecastHour;
  });
}

function createWeatherIconSrc(imgName) {
  import(`./asset/${imgName}.svg`).then((module) => {
    const img = document.getElementById("myimg");
    img.src = module.default;
  });
}

async function forecastHourIcon(nextTenHrs, iconIndex, imgIndex) {
  const forecastHoursNodelist = document.querySelectorAll(
    ".forecast-hour-icons"
  );
  const importedImage = await import(
    `./asset/${nextTenHrs[iconIndex].icon}.svg`
  );
  forecastHoursNodelist[imgIndex].src = importedImage.default;
}

async function forecastDayIcon(nextSixDays, iconIndex, imgIndex) {
  const forecastDayNodelist = document.querySelectorAll(".forecast-day-icons");
  const importedImage = await import(
    `./asset/${nextSixDays[iconIndex].icon}.svg`
  );
  forecastDayNodelist[imgIndex].src = importedImage.default;
}

function createBodyBackgroundSrc(imgName) {
  import(`./images/${imgName}.jpg`).then((module) => {
    const img = new Image();
    img.src = module.default;
    img.onload = () => {
      document.body.style.background = `url('${img.src}')`;
      document.body.style.backgroundAttachment = "fixed";
    };
  });
}

function forecastHoursDays(nextTenHrs, nextSixDays) {
  document.querySelectorAll(".forecast-hour-temp").forEach((el, i) => {
    el.textContent = `${Math.round(`${nextTenHrs[i].temp}`)}°`;
  });
  document.querySelectorAll(".forecast-day-temp-min").forEach((el, i) => {
    el.textContent = `L:${Math.round(`${nextSixDays[i].tempmin}`)}°`;
  });
  document.querySelectorAll(".forecast-day-temp-max").forEach((el, i) => {
    el.textContent = `H:${Math.round(`${nextSixDays[i].tempmax}`)}°`;
  });
  for (let i = 0; i < nextTenHrs.length; i += 1) {
    forecastHourIcon(nextTenHrs, [i], [i]);
  }

  for (let i = 0; i < nextSixDays.length; i += 1) {
    forecastDayIcon(nextSixDays, [i], [i]);
  }
}
function forecastAdditionalInfo(weatherInfo, unitGroup) {
  document.getElementById("temperature").textContent =
    `${Math.round(`${weatherInfo.currentConditions.temp}`)}°`;
  document.getElementById("weather-condition").textContent =
    weatherInfo.currentConditions.conditions;
  document.getElementById("wind-speed").textContent =
    `${Math.round(`${weatherInfo.currentConditions.windspeed}`)}`;
  document.getElementById("unit").textContent = `${handleUnitGroup(unitGroup)}`;
  document.getElementById("humidity").textContent =
    `${Math.round(`${weatherInfo.currentConditions.humidity}`)}%`;
  document.getElementById("feels-like").textContent =
    `${Math.round(`${weatherInfo.currentConditions.feelslike}`)}°`;
  document.getElementById("sunrise").textContent =
    roundHr(weatherInfo.currentConditions.sunrise) || "NA";
  document.getElementById("sunset").textContent =
    roundHr(weatherInfo.currentConditions.sunset) || "NA";
}

function hideLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.display = "none";
}

function showContent() {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.classList.add("loader-container-hidden");
}

// showing loading
function displayLoading() {
  const loader = document.querySelector("#loading");
  loader.classList.add("display");
  // to stop loading after some time
  setTimeout(() => {
    loader.classList.remove("display");
  }, 1000);
}

// hiding loading
function hideLoading() {
  const loader = document.querySelector("#loading");
  loader.classList.remove("display");
}

export {
  updateTime,
  showLocation,
  showDefaultIcons,
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
};
