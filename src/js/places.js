import { insertMarker, setMapCenter } from "./map";
import { buildPlaceTemplate, $placesResults, toggleShowPlaces } from "./ui";
import { placeResults } from "../../__fixtures__/places";

let placesService;
let currentPlacesMarkers = {};
let lastPlacesMarkerSelected;

function handlePlaceClick(event) {
  const placeId = event.target.parentNode.dataset.id;

  if (lastPlacesMarkerSelected) {
    lastPlacesMarkerSelected.setAnimation(null);
  }

  if (placeId) {
    const marker = currentPlacesMarkers[placeId];

    lastPlacesMarkerSelected = marker;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setMapCenter(marker.position, { pan: true });
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

      $placesResults.insertAdjacentHTML(
        "beforeend",
        buildPlaceTemplate(placeResult)
      );

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
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      renderPlaces(results);
    }
  });
}

export function testPlaces() {
  renderPlaces(placeResults);
}
