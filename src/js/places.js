import { map } from "../index";
import { insertInfoWindow, setMapCenter } from "./map";
import { insertMarker } from "./markers";
import {
  buildPlaceTemplate,
  $placesResults,
  scrollToHighlightedPlace,
  setHighlightedPlace,
  showLocationsError,
  showPlaceResults,
  showSearchAreaButton,
} from "./ui";
import { MIN_ZOOM_LEVEL, PLACE_SEARCH_RADIUS } from "./constants";

import placeMarkerURL from "../images/marker.png";

let placesService;
let currentPlacesMarkers = {};
let lastPlaceInfoWindowOpen = null;

export function initPlacesService() {
  placesService = new google.maps.places.PlacesService(map);
}

export function handlePlaceClick({ placeData, $placeElement }) {
  if (lastPlaceInfoWindowOpen) {
    lastPlaceInfoWindowOpen.close();
  }

  const marker = currentPlacesMarkers[placeData.place_id];
  const infoWindow = insertInfoWindow({ marker, content: placeData.name });
  lastPlaceInfoWindowOpen = infoWindow;

  scrollToHighlightedPlace($placeElement);
  setHighlightedPlace($placeElement);

  setMapCenter({
    locationLatLng: marker.position,
    pan: true,
  });
}

export function renderPlaces({ placeResults, bounds }) {
  placeResults
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .forEach((placeData) => {
      const placeLocationLatLng = placeData.geometry.location;
      bounds.extend(placeLocationLatLng);

      const placeMarker = insertMarker({
        locationLatLng: placeLocationLatLng,
        title: placeData.name,
        recenter: false,
        customMarkerURL: placeMarkerURL,
      });

      $placesResults.insertAdjacentHTML(
        "beforeend",
        buildPlaceTemplate(placeData)
      );

      const $placeElement = $placesResults.querySelector(
        `[data-id="${placeData.place_id}"]`
      );

      $placeElement.addEventListener("click", () =>
        handlePlaceClick({ placeData, $placeElement })
      );

      placeMarker.addListener("click", () =>
        handlePlaceClick({ placeData, $placeElement })
      );

      currentPlacesMarkers[placeData.place_id] = placeMarker;
    });

  // Fit the bounds of the middle plus places then zoom out if too close (higher number)
  map.fitBounds(bounds);

  if (map.getZoom() > MIN_ZOOM_LEVEL) {
    map.setOptions({ zoom: MIN_ZOOM_LEVEL });
  }

  showPlaceResults({ show: true });
}

/*
  Shows places within a 500 meter radius of the target location (the 'middle')
*/
export function getNearbyPlaces({ middlePointLatLng, bounds }) {
  const type = document.querySelector('input[name="place-type"]:checked').value;

  const request = {
    location: middlePointLatLng,
    radius: PLACE_SEARCH_RADIUS,
    type,
  };

  placesService.nearbySearch(request, (placeResults, status) => {
    if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      showLocationsError(
        "Sorry we couldn't find anywhere nearby, please try searching again..."
      );
    }

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      renderPlaces({ placeResults, bounds });
    }
  });
}

export function handleSearchAreaButtonClicked(newMiddlePointLatLng) {
  let bounds = new google.maps.LatLngBounds();
  bounds.extend(newMiddlePointLatLng);

  resetPlaces();

  getNearbyPlaces({ middlePointLatLng: newMiddlePointLatLng, bounds });
  showSearchAreaButton({ hideImmediate: true });
}

/*
  Remove places and markers from the DOM and clear references in memory
*/
export function resetPlaces() {
  lastPlaceInfoWindowOpen = null;
  $placesResults.innerHTML = "";

  Object.keys(currentPlacesMarkers).forEach((key) => {
    currentPlacesMarkers[key].setMap(null);
  });

  currentPlacesMarkers = {};
}
