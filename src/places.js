import { insertMarker } from "./map";
import { placeResults } from "../__fixtures__/places";

let placesService;

function buildPlaceTemplate(place) {
  return `
    <div class="place">
      <h3>${place.name}</h3>
      <p>Address: ${place.vicinity}</p>
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
      results.forEach(placeResult => {
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
