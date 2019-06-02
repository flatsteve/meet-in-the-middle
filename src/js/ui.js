import { handleMeetButtonClicked, handleAddressSelected } from "./locations";
import { resetPlaces, handleSearchAreaButtonClicked } from "./places";
import { clearMarkers } from "./markers";
import { getGeoLocation } from "./geo";
import { PLACE_IMG_WIDTH } from "./constants";
import { scrollTop } from "./utils";

import spinner from "../images/icons/spinner.svg";
import fullStar from "../images/icons/full-star.svg";
import halfStar from "../images/icons/half-star.svg";
import emptyStar from "../images/icons/empty-star.svg";

export const $placesResults = document.querySelector(".places__results");
const $placesContainer = document.querySelector(".places");
const $locationsContainer = document.querySelector(".locations");
const $geolocationIconButton = document.querySelector(
  ".geolocation-icon-button"
);
const $locationsForm = document.getElementById("locations-form");
const $locationLoading = document.querySelector(".location-loading");
const $yourLocationInput = document.getElementById("yourLocation");
const $meetButton = document.getElementById("meet");
const $searchAreaButton = document.getElementById("searchArea");
const $searchAgainButton = document.querySelector(".search-again");

let searchAreaLocation;
let searchAreaButtonTimeout;

function resetUI() {
  clearMarkers();
  resetPlaces();
  $locationsForm.reset();
  setMeetButtonDisabled(true);
}

function getPlacePhoto(placeData) {
  if (!placeData) {
    return;
  }

  if (placeData.photos && placeData.photos[0].getUrl) {
    const placeImageURL = placeData.photos[0].getUrl({
      maxWidth: PLACE_IMG_WIDTH
    });

    return `<div class="place__image" style="background-image: url(${placeImageURL})"></div>`;
  }

  return '<div class="place__image"><p>No image found</p></div>';
}

/*
  Returns a sting containing "£" characters representing the price level
*/
function getPriceLevel(placeData) {
  if (!placeData.price_level) {
    return "";
  }

  const prices = [];

  for (let i = 0; i < placeData.price_level; i++) {
    prices.push("£");
  }

  return prices.join("");
}

function getPlaceMapURL(placeData) {
  return `https://www.google.com/maps/search/?api=1&query=${
    placeData.name
  }&query_place_id=${placeData.place_id}`;
}

/*
  Returns a sting containing SVG stars filled to the closest 0.5
*/
function getPlaceStarRating(rating) {
  if (!rating) {
    return "No rating";
  }

  const RATING_TOTAL = 5;
  const stars = [];
  const remainder = Math.round((rating % 1) * 2) / 2;

  for (let i = 1; i <= RATING_TOTAL; i++) {
    if (i <= rating) {
      stars.push(fullStar);
    } else {
      stars.push(emptyStar);
    }
  }

  if (remainder === 0.5) {
    stars[Math.floor(rating)] = halfStar;
  }

  if (remainder === 1) {
    stars[Math.floor(rating)] = fullStar;
  }

  return stars.join("");
}

export function buildPlaceTemplate(placeData) {
  return `
    <div class="place" data-id="${placeData.id}">
      ${getPlacePhoto(placeData)}

      <h3 class="place__title">${placeData.name}</h3>
      <p class="place__details"> 
        <span class="place__rating">
          <strong>${placeData.rating || ""}</strong> 
          <span class="place__rating__stars">
            ${getPlaceStarRating(placeData.rating)}
          </span> 
          (${placeData.user_ratings_total || 0}) 
        </span>
        
        <span class="place__price">
          <strong>${getPriceLevel(placeData)}</strong>
        </span>
      </p>
      <p class="place__address">${placeData.vicinity}</p>
      <a href="${getPlaceMapURL(placeData)}" target="_blank">
        Open in Google Maps
      </a>
    </div>
  `;
}

export function hideLocationsError() {
  const errorMessage = document.querySelector(".locations__error");

  if (document.querySelector(".locations__error")) {
    errorMessage.parentElement.removeChild(errorMessage);
  }
}

export function showLocationsError(message) {
  $locationsContainer.insertAdjacentHTML(
    "beforebegin",
    `<p class="locations__error">${message}</p>`
  );
}

export function setMeetButtonDisabled(shouldBeDisabled) {
  if (shouldBeDisabled) {
    $meetButton.disabled = true;
  } else {
    $meetButton.disabled = false;
  }
}

export function setHighlightedPlace($placeResult) {
  const $highlightedPlace = $placesResults.querySelector(".place--highlighted");

  if ($highlightedPlace) {
    $highlightedPlace.classList.remove("place--highlighted");
  }

  $placeResult.classList.add("place--highlighted");
}

export function scrollToHighlightedPlace($placeResult) {
  const placesResultsMid = $placesResults.clientWidth / 2;
  const placeResultMid = $placeResult.clientWidth / 2;
  const MARGIN_OFFSET = 10;
  const leftOffset =
    $placeResult.offsetLeft - MARGIN_OFFSET - placesResultsMid + placeResultMid;

  $placesResults.scrollTo({
    top: 0,
    left: leftOffset,
    behavior: "smooth"
  });
}

export function showPlaceResults({ show }) {
  if (show) {
    $locationsContainer.classList.add("locations--hide");
    $placesContainer.classList.add("places--show");
  } else {
    $locationsContainer.classList.remove("locations--hide");
    $placesContainer.classList.remove("places--show");

    resetUI();
    scrollTop(0);
  }
}

export function toggleLocationLoading(shouldShow) {
  const loadingTemplate = `${spinner} <p>Getting your current location...</p>`;

  if (shouldShow) {
    $locationsForm.setAttribute("disabled", "");
    $locationLoading.insertAdjacentHTML("beforeend", loadingTemplate);
  } else {
    $locationsForm.removeAttribute("disabled", "");
    $locationLoading.innerHTML = "";
  }
}

export function showSearchAreaButton({
  newMiddleLocation,
  hideImmediate = false
}) {
  function resetSearchArea() {
    $searchAreaButton.classList.remove("search-area-btn--show");
    searchAreaLocation = null;
  }

  if (hideImmediate) {
    resetSearchArea();
    return clearTimeout(searchAreaButtonTimeout);
  }

  if (searchAreaButtonTimeout) {
    clearTimeout(searchAreaButtonTimeout);
  }

  searchAreaButtonTimeout = setTimeout(() => {
    resetSearchArea();
  }, 5000);

  searchAreaLocation = newMiddleLocation;
  $searchAreaButton.classList.add("search-area-btn--show");
}

async function handleGeolocationIconClicked() {
  let position;

  try {
    position = await getGeoLocation;
  } catch (error) {
    alert(error);
  }

  if (!position) {
    return;
  }

  const coordinates = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  handleAddressSelected({
    inputId: "yourLocation",
    preSetCoordinates: coordinates
  });

  $yourLocationInput.value = "Current location";
}

/* 
  Event listeners
*/
$meetButton.addEventListener("click", handleMeetButtonClicked);
$searchAgainButton.addEventListener("click", () =>
  showPlaceResults({ show: false })
);
$searchAreaButton.addEventListener("click", () =>
  handleSearchAreaButtonClicked(searchAreaLocation)
);
$geolocationIconButton.addEventListener("click", handleGeolocationIconClicked);
