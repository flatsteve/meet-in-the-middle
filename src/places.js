import { insertMarker } from "./map";
import { placeResults } from "../__fixtures__/places";

let placesService;

function getPlacePhoto(place) {
  if (!place) {
    return;
  }

  if (place.photos) {
    const placeImageURL = place.photos[0].getUrl({
      maxWidth: 512
    });

    return `<div class="place__image" style="background-image: url(${placeImageURL})"></div>`;
  }

  return '<div class="place__image"></div>';
}

function buildPlaceTemplate(place) {
  return `
    <div class="place">
      ${getPlacePhoto(place)}

      <h3>${place.name}</h3>
      <p class="place__address">${place.vicinity}</p>
      <p>Rating: ${place.rating}</p>
    </div>
  `;
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

  const $placeDetailsContainer = document.querySelector(".place-details");

  placesService.nearbySearch(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results
        .sort((a, b) => {
          return b.rating - a.rating;
        })
        .forEach(placeResult => {
          const placeLocation = placeResult.geometry.location;

          insertMarker(placeLocation, { title: placeResult.name });
          $placeDetailsContainer.insertAdjacentHTML(
            "beforeend",
            buildPlaceTemplate(placeResult)
          );
        });
    }
  });
}

export function testPlaces() {
  const $placeDetailsContainer = document.querySelector(".place-details");

  placeResults.forEach(placeResult => {
    const placeLocation = placeResult.geometry.location;
    insertMarker(placeLocation, { title: placeResult.name });

    $placeDetailsContainer.insertAdjacentHTML(
      "beforeend",

      buildPlaceTemplate(placeResult)
    );
  });
}
