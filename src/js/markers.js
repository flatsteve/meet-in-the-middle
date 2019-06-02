import { map } from "../index";

import locationMarkerURL from "../images/location.png";

let mapMarkers = [];

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

/*
  Clear all markers on the map
*/
export function clearMarkers() {
  mapMarkers.forEach(marker => {
    marker.setMap(null);
  });
}
