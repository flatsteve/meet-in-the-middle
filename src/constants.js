export const CENTRAL_LND_COORDS = { lat: 51.515419, lng: -0.141099 };

export const MAP_CONFIG = {
  center: CENTRAL_LND_COORDS,
  mapTypeControl: false,
  zoom: 12
};

export const LOCATION_INPUTS_INITIAL_VALUES = {
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
