import { getMeetingPoint } from "./locations";

export const $placeDetailsContainer = document.querySelector(".place-details");
const $locationsContainer = document.querySelector(".locations");
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
    $placeDetailsContainer.classList.remove("place-details--show");
    uiState.placesShown = false;
  } else {
    $locationsContainer.classList.add("locations--hide");
    $placeDetailsContainer.classList.add("place-details--show");
    uiState.placesShown = true;
  }
}

$meetButton.addEventListener("click", getMeetingPoint);
$searchAgainButton.addEventListener("click", toggleShowPlaces);
