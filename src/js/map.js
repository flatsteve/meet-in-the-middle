import { showNearbyPlaces } from "./places";
import { MAP_CONFIG } from "./constants";

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
export function insertMarker(
  locationLatLng,
  {
    recenter = true,
    animation = "DROP",
    title = "Location",
    customMarkerURL = false,
    markerColour = "red"
  } = {}
) {
  let mapIcon;

  if (customMarkerURL) {
    mapIcon = {
      url: customMarkerURL,
      scaledSize: new google.maps.Size(25, 25)
    };
  } else {
    mapIcon = {
      url: `https://maps.google.com/mapfiles/ms/icons/${markerColour}-dot.png`
    };
  }

  const marker = new google.maps.Marker({
    position: locationLatLng,
    map: map,
    animation: google.maps.Animation[animation],
    title,
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

export function clearMarkers() {
  mapMarkers.forEach(marker => {
    marker.setMap(null);
  });
}

export function setMapCenter(geoLocation, { pan = false } = {}) {
  if (pan) {
    return map.panTo(geoLocation);
  }

  map.setCenter(geoLocation);
}

export function showMiddlePoint(bounds) {
  const centerPoint = bounds.getCenter();

  const centerPointMarker = insertMarker(centerPoint, {
    recenter: false,
    animation: "BOUNCE",
    title: "The middle!",
    markerColour: "blue"
  });

  map.fitBounds(bounds);

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  showNearbyPlaces(centerPoint);

  // Stop the middle point marker from bouncing after 3 seconds
  setTimeout(() => {
    centerPointMarker.setAnimation(null);
  }, 3000);
}
