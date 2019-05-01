import { insertMarker } from "./map";
import {
  buildPlaceTemplate,
  $placeDetailsContainer,
  toggleShowPlaces
} from "./ui";
import { placeResults } from "../../__fixtures__/places";

let placesService;
let currentPlaces = {};

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

  toggleShowPlaces();
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
