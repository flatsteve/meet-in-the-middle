import { showNearbyPlaces, resetPlaces } from "./places";
import { MAP_CONFIG } from "./constants";

import middleMarkerURL from "../images/middle.png";
import locationMarkerURL from "../images/location.png";

let map;
let mapMarkers = [];

/*
  Initialize the map (runs after Google Maps is synchronously loaded)
*/
export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), MAP_CONFIG);

  return map;
}

/*
  Insert marker on the map and recenter to show the marker by default
*/
export function insertMarker({
  locationLatLng,
  recenter = true,
  animation = "DROP",
  title = "Location",
  draggable = false,
  customMarkerURL = locationMarkerURL,
  customMarkerWidth = 25,
  customMarkerHeight = 25
} = {}) {
  const mapIcon = {
    url: customMarkerURL,
    scaledSize: new google.maps.Size(customMarkerWidth, customMarkerHeight)
  };

  const marker = new google.maps.Marker({
    position: locationLatLng,
    map,
    title,
    draggable,
    animation: google.maps.Animation[animation],
    icon: mapIcon
  });

  if (recenter) {
    map.setOptions({
      center: locationLatLng,
      zoom: 15
    });
  }

  mapMarkers.push(marker);

  return marker;
}

export function insertInfoWindow({ content, marker }) {
  const infoWindow = new google.maps.InfoWindow({
    content
  });

  infoWindow.open(map, marker);

  return infoWindow;
}

/*
  Clean all markers on the map
*/
export function clearMarkers() {
  mapMarkers.forEach(marker => {
    marker.setMap(null);
  });
}

export function setMapCenter({ locationLatLng, pan = false } = {}) {
  if (pan) {
    return map.panTo(locationLatLng);
  }

  map.setCenter(locationLatLng);
}

export function showMiddlePoint(bounds) {
  const middlePoint = bounds.getCenter();
  const title = "The Middle";

  const middlePointMarker = insertMarker({
    locationLatLng: middlePoint,
    customMarkerURL: middleMarkerURL,
    recenter: false,
    animation: "BOUNCE",
    draggable: true,
    title
  });

  middlePointMarker.addListener("click", () =>
    insertInfoWindow({ marker: middlePointMarker, content: title })
  );

  map.fitBounds(bounds);

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  showNearbyPlaces(middlePoint);

  // Listen for the middle marker being moved
  google.maps.event.addListener(middlePointMarker, "dragend", position => {
    // TODO show an overlay button asking to "Search here"

    const newMiddlePoint = {
      lat: position.latLng.lat(),
      lng: position.latLng.lng()
    };

    resetPlaces();

    showNearbyPlaces(newMiddlePoint);
  });

  // Stop the middle point marker from bouncing after some seconds
  setTimeout(() => {
    middlePointMarker.setAnimation(null);
  }, 2700);
}
