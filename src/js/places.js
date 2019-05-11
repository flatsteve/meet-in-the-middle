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

import placeMarkerURL from "../images/marker.png";

let placesService;
let currentPlacesMarkers = {};
let lastInfoWindowOpen;

export function initPlacesService() {
  placesService = new google.maps.places.PlacesService(map);
}

export function handlePlaceClick({ placeData, $placeElement }) {
  if (lastInfoWindowOpen) {
    lastInfoWindowOpen.close();
  }

  const marker = currentPlacesMarkers[placeData.id];

  const infoWindow = new google.maps.InfoWindow({
    content: placeData.name
  });

  infoWindow.open(map, marker);
  lastInfoWindowOpen = infoWindow;

  scrollToHighlightedPlace($placeElement);
  setHighlightedPlace($placeElement);

  setMapCenter({
    locationLatLng: marker.position,
    pan: true
  });
}

function renderPlaces(places) {
  places
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .forEach(placeData => {
      const marker = insertMarker({
        locationLatLng: placeData.geometry.location,
        title: placeData.name,
        customMarkerURL: placeMarkerURL
      });

      $placesResults.insertAdjacentHTML(
        "beforeend",
        buildPlaceTemplate(placeData)
      );

      const $placeElement = $placesResults.querySelector(
        `[data-id="${placeData.id}"]`
      );

      $placeElement.addEventListener("click", () =>
        handlePlaceClick({ placeData, $placeElement })
      );

      marker.addListener("click", () =>
        handlePlaceClick({ placeData, $placeElement })
      );

      currentPlacesMarkers[placeData.id] = marker;
    });

  toggleShowPlaces();
}

/*
  Shows places within a 500 meter radius of the target location (the 'middle')
*/
export function showNearbyPlaces(location) {
  const type = document.querySelector('input[name="place-type"]:checked').value;

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

/*
  Remove places from the DOM and clear references in memory
*/
export function resetPlaces() {
  lastInfoWindowOpen = null;
  currentPlacesMarkers = {};
  $placesResults.innerHTML = "";
}

export function testPlaces() {
  renderPlaces(placeResults);
}
