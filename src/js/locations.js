import { insertMarker, showMiddlePoint, setMapCenter } from "./map";
import { toggleMeetButtonDisabled } from "./ui";
import { LOCATION_INPUTS_INITIAL_VALUES } from "./constants";

let locationInputs = LOCATION_INPUTS_INITIAL_VALUES;

const getGeoLocation = new Promise(resolve => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const geoPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const circle = new google.maps.Circle({
          center: geoPosition,
          radius: position.coords.accuracy
        });

        const geoBounds = circle.getBounds();

        setMapCenter(geoPosition);
        resolve(geoBounds);
      },
      () => {
        // User may have blocked location
        resolve(null);
      },
      { timeout: 10000 }
    );
  } else {
    resolve(null);
  }
});

export async function initLocationsAutocomplete() {
  const bounds = await getGeoLocation;

  locationInputs.yourLocation.ref = createAutocompleteInput({
    inputId: "yourLocation",
    bounds
  });

  locationInputs.theirLocation.ref = createAutocompleteInput({
    inputId: "theirLocation",
    bounds // TODO - should we constrain "their" bounds?
  });
}

/*
  Meet in the Middle was clicked
*/
export function getMeetingPoint() {
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
function handleAddressSelected(inputId) {
  let title;
  let markerColour;

  const place = locationInputs[inputId].ref.getPlace().geometry.location;
  const lat = place.lat();
  const lng = place.lng();
  const coordinates = { lat, lng };

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
    toggleMeetButtonDisabled();
  }
}

/*
  Creates a new autocomplete location input and binds the handleAddressSelected 
  function to fire when user selects a location - note that we only need the geometry
  of the selected place
*/
function createAutocompleteInput({ inputId, bounds }) {
  let input = new google.maps.places.Autocomplete(
    document.getElementById(inputId),
    { bounds, types: ["geocode"] }
  );

  input.setFields(["geometry"]);
  input.addListener("place_changed", () => handleAddressSelected(inputId));

  return input;
}

function isLocationsComplete() {
  for (let inputKey in locationInputs) {
    if (!locationInputs[inputKey].coordinates) {
      return false;
    }
  }

  return true;
}
