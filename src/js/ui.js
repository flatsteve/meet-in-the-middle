import { handleMeetButtonClicked } from "./locations";
import { resetPlaces, handlePlaceClick } from "./places";
import { clearMarkers } from "./map";

import fullStar from "../images/icons/full-star.svg";
import halfStar from "../images/icons/half-star.svg";
import emptyStar from "../images/icons/empty-star.svg";

export const $placesResults = document.querySelector(".places__results");
const $placesContainer = document.querySelector(".places");
const $locationsContainer = document.querySelector(".locations");
const $locationsForm = document.getElementById("locations-form");
const $meetButton = document.getElementById("meet");
const $searchAgainButton = document.querySelector(".search-again");

let uiState = {
  placesShown: false
};

function getPlacePhoto(place) {
  if (!place) {
    return;
  }

  if (place.photos && place.photos[0].getUrl) {
    const placeImageURL = place.photos[0].getUrl({
      maxWidth: 512
    });

    return `<div class="place__image" style="background-image: url(${placeImageURL})"></div>`;
  }

  return '<div class="place__image"><p>No image found</p></div>';
}

function getPriceLevel(place) {
  if (!place.price_level) {
    return "";
  }

  const prices = [];

  for (let i = 0; i < place.price_level; i++) {
    prices.push("£");
  }

  return prices.join("");
}

function getPlaceMapURL(place) {
  return `https://www.google.com/maps/search/?api=1&query=${
    place.name
  }&query_place_id=${place.place_id}`;
}

function getPlaceStars(rating) {
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

function resetUI() {
  clearMarkers();
  resetPlaces();
  $locationsForm.reset();
  setMeetButtonDisabled(true);
}

export function buildPlaceTemplate(place) {
  return `
    <div class="place" data-id="${place.id}">
      ${getPlacePhoto(place)}

      <h3 class="place__title">${place.name}</h3>
      <p class="place__details"> 
        <span class="place__rating">
          <strong>${place.rating || ""}</strong> 
          <span class="place__rating__stars">
            ${getPlaceStars(place.rating)}
          </span> 
          (${place.user_ratings_total || 0}) 
        </span>
        
        <span class="place__price">
          <strong>${getPriceLevel(place)}</strong>
        </span>
      </p>
      <p class="place__address">${place.vicinity}</p>
      <a href="${getPlaceMapURL(place)}" target="_blank">
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

export function toggleShowPlaces() {
  if (uiState.placesShown) {
    $locationsContainer.classList.remove("locations--hide");
    $placesContainer.classList.remove("places--show");
    uiState.placesShown = false;

    resetUI();
  } else {
    $locationsContainer.classList.add("locations--hide");
    $placesContainer.classList.add("places--show");
    uiState.placesShown = true;
  }
}

$meetButton.addEventListener("click", handleMeetButtonClicked);
$searchAgainButton.addEventListener("click", toggleShowPlaces);
