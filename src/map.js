import { initAutocomplete } from "./locations";
import { CENTRAL_LND_COORDS } from "./constants";

let map;

export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: CENTRAL_LND_COORDS,
    zoom: 12
  });

  initAutocomplete();
}

export function insertMarker(locationLatLng) {
  const marker = new google.maps.Marker({
    position: locationLatLng,
    map: map,
    title: "Hello World"
  });

  map.setOptions({
    center: locationLatLng,
    zoom: 15
  });

  return marker;
}

export function fitBounds(bounds) {
  map.fitBounds(bounds);
}

export function setMapCenter(geoLocation) {
  map.setCenter(geoLocation);
}
