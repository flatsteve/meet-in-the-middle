import { getMeetingPoint } from "./locations";
import { resetPlaces } from "./places";
import { clearMarkers } from "./map";

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

function resetUI() {
  clearMarkers();
  resetPlaces();
  $locationsForm.reset();
}

export function buildPlaceTemplate(place) {
  return `
    <div class="place" data-id="${place.id}">
      ${getPlacePhoto(place)}

      <h3 class="place__title">${place.name}</h3>
      <p class="place__address">${place.vicinity}</p>
      <p>Rating: ${place.rating}</p>
    </div>
  `;
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

$meetButton.addEventListener("click", getMeetingPoint);
$searchAgainButton.addEventListener("click", toggleShowPlaces);
