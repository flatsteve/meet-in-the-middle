import {
  insertInfoWindow,
  insertMarker,
  showMiddlePointAndPlaces,
  setMapCenter
} from "./map";
import { getGeoLocation } from "./geo";
import {
  hideLocationsError,
  toggleLocationLoading,
  setMeetButtonDisabled
} from "./ui";
import { LOCATION_INPUTS_INITIAL_VALUES, TABLET_WIDTH } from "./constants";
import { scrollTop } from "./utils";

let locationInputs = LOCATION_INPUTS_INITIAL_VALUES;

export async function initLocationsAutocomplete() {
  let position;
  let bounds = null;

  try {
    toggleLocationLoading(true);

    position = await getGeoLocation;

    toggleLocationLoading(false);

    const locationLatLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    setMapCenter({ locationLatLng });

    const circle = new google.maps.Circle({
      center: locationLatLng,
      radius: position.coords.accuracy
    });

    bounds = circle.getBounds();
  } catch (error) {
    toggleLocationLoading(false);
  }

  locationInputs.yourLocation.ref = createAutocompleteInput({
    inputId: "yourLocation",
    bounds
  });

  locationInputs.theirLocation.ref = createAutocompleteInput({
    inputId: "theirLocation",
    bounds
  });
}

/*
  Meet in the Middle was clicked
*/
export function handleMeetButtonClicked() {
  // Clear any previous errors getting the meeting point
  hideLocationsError();

  let bounds = new google.maps.LatLngBounds();

  for (let input in locationInputs) {
    bounds.extend(locationInputs[input].coordinates);
  }

  const middlePointLatLng = bounds.getCenter();

  showMiddlePointAndPlaces({ middlePointLatLng });
}

/*
  Handle when address was selected from Google Places select and
  get the lat lng to insert a marker - also clears any previous marker
*/
export function handleAddressSelected({
  inputId,
  preSetCoordinates = false
} = {}) {
  let title = "Location";
  let coordinates;

  // 'Your location' coordinates can also be set by getting the users geolocation
  if (!preSetCoordinates) {
    const place = locationInputs[inputId].ref.getPlace().geometry.location;
    const lat = place.lat();
    const lng = place.lng();
    coordinates = { lat, lng };
  } else {
    coordinates = preSetCoordinates;
  }

  if (inputId === "yourLocation") {
    title = "Your Location";
  } else {
    title = "Their Location";
  }

  locationInputs[inputId].coordinates = coordinates;

  if (locationInputs[inputId].marker) {
    locationInputs[inputId].marker.setMap(null);
  }

  const marker = insertMarker({
    locationLatLng: coordinates,
    title,
    customMarkerHeight: 36
  });

  locationInputs[inputId].marker = marker;
  marker.addListener("click", () =>
    insertInfoWindow({ marker, content: title })
  );

  if (isLocationsComplete()) {
    setMeetButtonDisabled(false);
  }
}

/*
  Scroll the page down to to the input element to avoid keyboard overlap
*/
function handleInputFocus(inputElement) {
  if (window.innerWidth < TABLET_WIDTH) {
    scrollTop(inputElement.offsetTop);
  }
}

/*
  Creates a new autocomplete location input and binds the handleAddressSelected 
  function to fire when user selects a location - note that we only need the geometry
  of the selected place
*/
function createAutocompleteInput({ inputId, bounds }) {
  const inputElement = document.getElementById(inputId);
  inputElement.addEventListener("focus", () => handleInputFocus(inputElement));

  const inputAutocomplete = new google.maps.places.Autocomplete(inputElement, {
    bounds,
    types: ["geocode"]
  });

  inputAutocomplete.setFields(["geometry"]);
  inputAutocomplete.addListener("place_changed", () =>
    handleAddressSelected({ inputId })
  );

  return inputAutocomplete;
}

/*
  Validation function - returns false is any input has no coordinates
*/
function isLocationsComplete() {
  for (let inputKey in locationInputs) {
    if (!locationInputs[inputKey].coordinates) {
      return false;
    }
  }

  return true;
}
