import { insertMarker } from "./map";
import { placeResults } from "../__fixtures__/places";

let placesService;
let currentPlaces = {};

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

  return '<div class="place__image"></div>';
}

function buildPlaceTemplate(place) {
  return `
    <div class="place" data-id="${place.id}">
      ${getPlacePhoto(place)}

      <h3 class="place__title">${place.name}</h3>
      <p class="place__address">${place.vicinity}</p>
      <p>Rating: ${place.rating}</p>
    </div>
  `;
}

/*
  Resets any marker animations back to null
*/
function resetCurrentPlaceMarkers() {
  for (let key in currentPlaces) {
    currentPlaces[key].setAnimation(null);
  }
}

function handlePlaceClick(event) {
  resetCurrentPlaceMarkers();
  const placeId = event.target.parentNode.dataset.id;

  if (placeId) {
    currentPlaces[placeId].setAnimation(google.maps.Animation.BOUNCE);
  }
}

function renderPlaces(places) {
  const $placeDetailsContainer = document.querySelector(".place-details");

  places
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .forEach(placeResult => {
      const placeLocation = placeResult.geometry.location;

      const marker = insertMarker(placeLocation, { title: placeResult.name });

      $placeDetailsContainer.insertAdjacentHTML(
        "beforeend",
        buildPlaceTemplate(placeResult)
      );

      currentPlaces[placeResult.id] = marker;
    });

  $placeDetailsContainer.addEventListener("click", handlePlaceClick);
}

export function initPlacesService(map) {
  placesService = new google.maps.places.PlacesService(map);
}

export function showNearbyPlaces(location, { type = "restaurant" } = {}) {
  const request = {
    location,
    radius: "500",
    type
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      renderPlaces(results);
    }
  });
}

export function testPlaces() {
  renderPlaces(placeResults);
}
