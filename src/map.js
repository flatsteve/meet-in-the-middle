import { MAP_CONFIG } from "./constants";

let map;

/*
  Initialize the map (runs after Google Maps is synchronously loaded)
*/
export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), MAP_CONFIG);
}

/*
  Insert marker on the map and recenter to show the marker by default
*/
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

export function setMapCenter(geoLocation) {
  map.setCenter(geoLocation);
}

export function showMeetingPoint(bounds) {
  insertMarker(bounds.getCenter(), { recenter: false, animation: "BOUNCE" });
  map.fitBounds(bounds);
}
