import { getNearbyPlaces } from "./places";
import { MAP_CONFIG } from "./constants";

let map;

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
    markerColour = "red"
  } = {}
) {
  const markerURL = `http://maps.google.com/mapfiles/ms/icons/${markerColour}-dot.png`;
  const marker = new google.maps.Marker({
    position: locationLatLng,
    map: map,
    animation: google.maps.Animation[animation],
    title,
    icon: {
      url: markerURL
    }
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
  const centerPoint = bounds.getCenter();
  insertMarker(centerPoint, {
    recenter: false,
    animation: "BOUNCE",
    title: "The middle!"
  });
  map.fitBounds(bounds);
  getNearbyPlaces(centerPoint);
}
