import { initMap } from "./js/map";
import { initLocationsAutocomplete } from "./js/locations";
import { initPlacesService, testPlaces } from "./js/places";

import "./styles.scss";

if (module.hot) {
  module.hot.accept();
}

const map = initMap();
initLocationsAutocomplete();
initPlacesService(map);
// testPlaces();
