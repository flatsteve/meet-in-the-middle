import { initAutocomplete } from "./locations";

let map;

export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
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
