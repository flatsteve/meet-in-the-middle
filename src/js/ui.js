import { handleMeetButtonClicked } from "./locations";
import { resetPlaces } from "./places";
import { clearMarkers } from "./map";

export const $placesResults = document.querySelector(".places__results");
const $placesContainer = document.querySelector(".places");
const $locationsContainer = document.querySelector(".locations");
const $locationsForm = document.getElementById("locations-form");
const $meetButton = document.getElementById("meet");
const $searchAgainButton = document.querySelector(".search-again");

let uiState = {
  placesShown: false,
  meetButtonDisabled: true
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
    return "Unknown";
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

function resetUI() {
  clearMarkers();
  resetPlaces();
  $locationsForm.reset();
  toggleMeetButtonDisabled();
}

export function buildPlaceTemplate(place) {
  return `
    <div class="place" data-id="${place.id}">
      ${getPlacePhoto(place)}

      <h3 class="place__title">${place.name}</h3>
      <p>Rating: ${place.rating} (${place.user_ratings_total})</p>
      <p>Price: ${getPriceLevel(place)}</p>
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

export function toggleMeetButtonDisabled() {
  if (uiState.meetButtonDisabled) {
    $meetButton.disabled = false;
    uiState.meetButtonDisabled = false;
  } else {
    $meetButton.disabled = true;
    uiState.meetButtonDisabled = true;
  }
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
