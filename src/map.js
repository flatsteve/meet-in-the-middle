import { initAutocomplete } from "./locations";
import { CENTRAL_LND_COORDS } from "./constants";

let map;

export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: CENTRAL_LND_COORDS,
    mapTypeControl: false,
    zoom: 12
  });

  initAutocomplete();
}

export function insertMarker(
  locationLatLng,
  { recenter = true, animation = "DROP" } = {}
) {
  const marker = new google.maps.Marker({
    position: locationLatLng,
    map: map,
    animation: google.maps.Animation[animation],
    title: "Hello World"
  });

  if (recenter) {
    map.setOptions({
      center: locationLatLng,
      zoom: 15
    });
  }

  return marker;
}

export function showMeetingPoint(bounds) {
  insertMarker(bounds.getCenter(), { recenter: false, animation: "BOUNCE" });
  map.fitBounds(bounds);
}

export function setMapCenter(geoLocation) {
  map.setCenter(geoLocation);
}
