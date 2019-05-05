import { insertMarker, setMapCenter } from "./map";
import {
  buildPlaceTemplate,
  handlePlaceMarkerClick,
  $placesResults,
  toggleShowPlaces,
  showLocationsError
} from "./ui";
import { placeResults } from "../../__fixtures__/places";

let placesService;
let currentPlacesMarkers = {};
let lastPlacesMarkerSelected;

export function handlePlaceClick(event, { placeId = false } = {}) {
  // Place id can be passed in by clicking the marker however a place
  // can also be clicked from the results list
  if (!placeId) {
    placeId = event.target.parentNode.dataset.id;
  }

  if (lastPlacesMarkerSelected) {
    lastPlacesMarkerSelected.setAnimation(null);
  }

  const marker = currentPlacesMarkers[placeId];

  lastPlacesMarkerSelected = marker;
  marker.setAnimation(google.maps.Animation.BOUNCE);
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

      marker.addListener("click", () => handlePlaceMarkerClick(placeResult));

      currentPlacesMarkers[placeResult.id] = marker;
    });

  $placesResults.addEventListener("click", handlePlaceClick);

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
  lastPlacesMarkerSelected = null;
  currentPlacesMarkers = {};
  $placesResults.innerHTML = "";
}

export function testPlaces() {
  renderPlaces(placeResults);
}
