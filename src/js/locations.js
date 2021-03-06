import {
  insertInfoWindow,
  showMiddlePointAndPlaces,
  setMapCenter,
} from "./map";
import { insertMarker } from "./markers";
import { getGeoLocation } from "./geo";
import {
  addNewLocation,
  hideLocationsError,
  toggleLocationLoading,
} from "./ui";
import { validateLocationsForm } from "./validation";
import {
  NEW_LOCATION_CONTAINER_PREFIX,
  NEW_LOCATION_INPUT_PREFIX,
  REMOVE_LOCATION_BUTTON_PREFIX,
  TABLET_WIDTH,
} from "./constants";
import { removeElement, scrollTop } from "./utils";

let locationInputs = {};
let geoLocationBounds;

export async function initLocationsAutocomplete() {
  let position;

  try {
    toggleLocationLoading(true);

    position = await getGeoLocation;

    toggleLocationLoading(false);

    const locationLatLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    setMapCenter({ locationLatLng });

    const circle = new google.maps.Circle({
      center: locationLatLng,
      radius: position.coords.accuracy,
    });

    geoLocationBounds = circle.getBounds();
  } catch (error) {
    toggleLocationLoading(false);
  }

  createAutocompleteInput({
    inputId: "yourLocation",
    geoLocationBounds,
  });

  createAutocompleteInput({
    inputId: "theirLocation",
    geoLocationBounds,
  });
}

function handleRemoveLocation(index) {
  const location = document.getElementById(
    `${NEW_LOCATION_CONTAINER_PREFIX}${index}`
  );

  removeElement(location);
  delete locationInputs[`${NEW_LOCATION_INPUT_PREFIX}${index}`];
}

/*
  Add a new location input and setup listeners to remove
*/
export function addLocationInput() {
  const index = addNewLocation();

  createAutocompleteInput({
    inputId: `${NEW_LOCATION_INPUT_PREFIX}${index}`,
    geoLocationBounds,
  });

  const $removeLocationButton = document.getElementById(
    `${REMOVE_LOCATION_BUTTON_PREFIX}${index}`
  );

  $removeLocationButton.addEventListener("click", () => {
    handleRemoveLocation(index);
  });
}

/*
  Meet in the Middle was clicked
*/
export function handleMeetButtonClicked() {
  // Clear any previous errors getting the meeting point
  hideLocationsError();

  const hasError = validateLocationsForm({ inputs: locationInputs });

  if (hasError) {
    return;
  }

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
  preSetCoordinates = false,
} = {}) {
  let title = "Location";
  let coordinates;

  // 'Your location' coordinates can also be set by getting the users geolocation
  if (!preSetCoordinates) {
    const place = locationInputs[inputId].autocomplete.getPlace().geometry
      .location;
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
    customMarkerHeight: 36,
  });

  locationInputs[inputId].marker = marker;
  marker.addListener("click", () =>
    insertInfoWindow({ marker, content: title })
  );
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
function createAutocompleteInput({ inputId, geoLocationBounds = null }) {
  const inputElement = document.getElementById(inputId);

  const inputAutocomplete = new google.maps.places.Autocomplete(inputElement, {
    bounds: geoLocationBounds,
    types: ["geocode"],
  });

  locationInputs[inputId] = {
    autocomplete: inputAutocomplete,
    element: inputElement,
    coordinates: null,
    marker: null,
  };

  inputAutocomplete.setFields(["geometry"]);

  inputAutocomplete.addListener("place_changed", () => {
    handleAddressSelected({ inputId });
    validateLocationsForm({ inputs: locationInputs });
  });

  inputElement.addEventListener("focus", () => handleInputFocus(inputElement));
  inputElement.addEventListener("blur", () =>
    validateLocationsForm({ inputs: locationInputs })
  );
}
