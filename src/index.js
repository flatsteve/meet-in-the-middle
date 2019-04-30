import { initMap } from "./map";
import { initLocationsAutocomplete } from "./locations";
import { initPlacesService, testPlaces } from "./places";
import { getMeetingPoint } from "./locations";

import "./styles.scss";

if (module.hot) {
  module.hot.accept();
}

// Initialize all services
const map = initMap();
initLocationsAutocomplete();
initPlacesService(map);
// testPlaces();

// TODO Move to controls file?
const meetButton = document.getElementById("meet");
meetButton.addEventListener("click", getMeetingPoint);
