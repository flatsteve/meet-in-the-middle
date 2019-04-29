import { insertMarker, showMeetingPoint, setMapCenter } from "./map";
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
        resolve(null); // USER MAY HAVE BLOCKED LOCATION
      }
    );
  } else {
    resolve(null);
  }
});

export async function initAutocomplete() {
  const bounds = await getGeoLocation;

  locationInputs.yourLocation.ref = createAutocompleteInput({
    inputId: "yourLocation",
    bounds
  });

  locationInputs.theirLocation.ref = createAutocompleteInput({
    inputId: "theirLocation",
    bounds
  });
}

export function getMeetingPoint() {
  let bounds = new google.maps.LatLngBounds();

  for (let input in locationInputs) {
    bounds.extend(locationInputs[input].coordinates);
  }

  showMeetingPoint(bounds);
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

function createAutocompleteInput({ inputId, bounds }) {
  const input = new google.maps.places.Autocomplete(
    document.getElementById(inputId),
    { bounds, types: ["geocode"] }
  );

  input.setFields(["address_component", "geometry"]);
  input.addListener("place_changed", () => handleAddressSelected(inputId));

  return input;
}
