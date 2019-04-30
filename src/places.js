import { insertMarker } from "./map";

let placesService;

export function initPlacesService(map) {
  placesService = new google.maps.places.PlacesService(map);
}

export function getNearbyPlaces(location, { type = "restaurant" } = {}) {
  const request = {
    location,
    radius: "500",
    type
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);

      results.forEach(placeResult => {
        const placeLocation = placeResult.geometry.location;
        insertMarker(placeLocation, { title: placeResult.name });
      });
    }
  });
}
