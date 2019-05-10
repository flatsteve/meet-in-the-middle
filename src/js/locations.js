import { insertMarker, showMiddlePoint, setMapCenter } from "./map";
import { getGeoLocation } from "./geo";
import {
  hideLocationsError,
  toggleLocationLoading,
  setMeetButtonDisabled
} from "./ui";
import { LOCATION_INPUTS_INITIAL_VALUES, TABLET_WIDTH } from "./constants";

let locationInputs = LOCATION_INPUTS_INITIAL_VALUES;

export async function initLocationsAutocomplete() {
  let position;
  let bounds = null;

  try {
    toggleLocationLoading(true);

    position = await getGeoLocation;

    toggleLocationLoading(false);

    const geoPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    setMapCenter(geoPosition);

    const circle = new google.maps.Circle({
      center: geoPosition,
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

  showMiddlePoint(bounds);
}

/*
  Handle when address was selected from Google Places select and
  get the lat lng to insert a marker - also clears any previous marker
*/
export function handleAddressSelected(
  inputId,
  { preSetCoordinates = false } = {}
) {
  let title;
  let markerColour;
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
    markerColour = "purple";
  } else {
    title = "Their Location";
    markerColour = "pink";
  }

  locationInputs[inputId].coordinates = coordinates;

  if (locationInputs[inputId].marker) {
    locationInputs[inputId].marker.setMap(null);
  }

  locationInputs[inputId].marker = insertMarker(coordinates, {
    title,
    markerColour
  });

  if (isLocationsComplete()) {
    setMeetButtonDisabled(false);
  }
}

function handleInputFocus(inputElement) {
  if (window.innerWidth < TABLET_WIDTH) {
    window.scrollTo({
      top: inputElement.offsetTop,
      left: 0,
      behavior: "smooth"
    });
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
    handleAddressSelected(inputId)
  );

  return inputAutocomplete;
}

function isLocationsComplete() {
  for (let inputKey in locationInputs) {
    if (!locationInputs[inputKey].coordinates) {
      return false;
    }
  }

  return true;
}
