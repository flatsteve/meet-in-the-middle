import { insertMarker, fitBounds } from "./map";

let locationInputs = {
  yourLocation: {
    coordinates: null,
    ref: null,
    marker: null
  },
  theirLocation: {
    coordinates: null,
    ref: null,
    marker: null
  }
};

export function initAutocomplete() {
  locationInputs.yourLocation.ref = createAutocompleteInput("yourLocation");
  locationInputs.theirLocation.ref = createAutocompleteInput("theirLocation");
}

export function getMeetingPoint() {
  let bounds = new google.maps.LatLngBounds();

  for (let input in locationInputs) {
    bounds.extend(locationInputs[input].coordinates);
  }

  fitBounds(bounds);
}

function handleAddressSelected(inputId) {
  const place = locationInputs[inputId].ref.getPlace().geometry.location;

  const lat = place.lat();
  const lng = place.lng();
  const coordinates = { lat, lng };

  locationInputs[inputId].coordinates = coordinates;

  if (locationInputs[inputId].marker) {
    locationInputs[inputId].marker.setMap(null);
  }

  locationInputs[inputId].marker = insertMarker(coordinates);
}

function createAutocompleteInput(inputId) {
  const input = new google.maps.places.Autocomplete(
    document.getElementById(inputId),
    { types: ["geocode"] }
  );

  input.setFields(["address_component", "geometry"]);
  input.addListener("place_changed", () => handleAddressSelected(inputId));

  return input;
}
