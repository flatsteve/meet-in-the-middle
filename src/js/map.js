import { insertMarker } from "./markers";
import { getNearbyPlaces } from "./places";
import { MAP_CONFIG } from "./constants";
import { showSearchAreaButton } from "./ui";
import { scrollTop } from "./utils";

import middleMarkerURL from "../images/middle.png";

let map;

/*
  Initialize the map (runs after Google Maps is synchronously loaded)
*/
export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), MAP_CONFIG);

  return map;
}

export function insertInfoWindow({ content, marker }) {
  const infoWindow = new google.maps.InfoWindow({
    content,
  });

  infoWindow.open(map, marker);

  return infoWindow;
}

export function setMapCenter({ locationLatLng, pan = false } = {}) {
  if (pan) {
    return map.panTo(locationLatLng);
  }

  map.setCenter(locationLatLng);
}

/*
  Show the middle point and nearby places
*/
export function showMiddlePointAndPlaces({
  middlePointLatLng,
  showPlaces = true,
}) {
  const title = "The Middle";

  let bounds = new google.maps.LatLngBounds();
  bounds.extend(middlePointLatLng);

  if (showPlaces) {
    getNearbyPlaces({ middlePointLatLng, bounds });
  }

  const middlePointMarker = insertMarker({
    locationLatLng: middlePointLatLng,
    customMarkerURL: middleMarkerURL,
    recenter: false,
    animation: "BOUNCE",
    draggable: true,
    title,
  });

  middlePointMarker.addListener("click", () =>
    insertInfoWindow({ marker: middlePointMarker, content: title })
  );

  scrollTop(0);

  // Listen for the middle marker being moved
  google.maps.event.addListener(middlePointMarker, "dragend", (position) => {
    const newMiddleLocation = {
      lat: position.latLng.lat(),
      lng: position.latLng.lng(),
    };

    showSearchAreaButton({ newMiddleLocation });
  });

  // Stop the middle point marker from bouncing after some seconds
  setTimeout(() => {
    middlePointMarker.setAnimation(null);
  }, 1500);
}
