import { getNearbyPlaces } from "./places";
import { MAP_CONFIG } from "./constants";
import { showSearchAreaButton } from "./ui";
import { scrollTop } from "./utils";

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
    icon: mapIcon,
    animation: google.maps.Animation[animation]
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
  Clear all markers on the map
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

/*
  Show the middle point and nearby places
*/
export function showMiddlePointAndPlaces({
  middlePointLatLng,
  showPlaces = true
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
    title
  });

  middlePointMarker.addListener("click", () =>
    insertInfoWindow({ marker: middlePointMarker, content: title })
  );

  scrollTop(0);

  // Listen for the middle marker being moved
  google.maps.event.addListener(middlePointMarker, "dragend", position => {
    const newMiddleLocation = {
      lat: position.latLng.lat(),
      lng: position.latLng.lng()
    };

    showSearchAreaButton({ newMiddleLocation });
  });

  // Stop the middle point marker from bouncing after some seconds
  setTimeout(() => {
    middlePointMarker.setAnimation(null);
  }, 1500);
}
