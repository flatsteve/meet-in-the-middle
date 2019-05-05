import { map } from "../index";
import { insertMarker, setMapCenter } from "./map";
import {
  buildPlaceTemplate,
  $placesResults,
  scrollToHighlightedPlace,
  setHighlightedPlace,
  showLocationsError,
  toggleShowPlaces
} from "./ui";
import { placeResults } from "../../__fixtures__/places";

let placesService;
let currentPlacesMarkers = {};
let lastInfoWindowOpen;

export function initPlacesService() {
  placesService = new google.maps.places.PlacesService(map);
}

export function handlePlaceClick(place, $placeResult) {
  if (lastInfoWindowOpen) {
    lastInfoWindowOpen.close();
  }

  const marker = currentPlacesMarkers[place.id];

  const infoWindow = new google.maps.InfoWindow({
    content: place.name
  });

  infoWindow.open(map, marker);
  lastInfoWindowOpen = infoWindow;

  scrollToHighlightedPlace($placeResult);
  setHighlightedPlace($placeResult);
  setMapCenter(marker.position, { pan: true });
}

function renderPlaces(places) {
  places
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .forEach(placeResult => {
      const placeLocation = placeResult.geometry.location;
      const marker = insertMarker(placeLocation, { title: placeResult.name });

      $placesResults.insertAdjacentHTML(
        "beforeend",
        buildPlaceTemplate(placeResult)
      );

      const $insertedPlaceResult = $placesResults.querySelector(
        `[data-id="${placeResult.id}"]`
      );

      $insertedPlaceResult.addEventListener("click", () =>
        handlePlaceClick(placeResult, $insertedPlaceResult)
      );

      marker.addListener("click", () =>
        handlePlaceClick(placeResult, $insertedPlaceResult)
      );

      currentPlacesMarkers[placeResult.id] = marker;
    });

  toggleShowPlaces();
}

export function showNearbyPlaces(location, { type = "restaurant" } = {}) {
  const request = {
    location,
    radius: "500",
    type
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      showLocationsError(
        "Sorry we couldn't find anywhere nearby, please try searching again..."
      );
    }

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      renderPlaces(results);
    }
  });
}

export function resetPlaces() {
  lastInfoWindowOpen = null;
  currentPlacesMarkers = {};
  $placesResults.innerHTML = "";
}

export function testPlaces() {
  renderPlaces(placeResults);
}
