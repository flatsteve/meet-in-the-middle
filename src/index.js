import { initMap } from "./map";
import { initLocationsAutocomplete } from "./locations";
import { getMeetingPoint } from "./locations";

if (module.hot) {
  module.hot.accept();
}

initMap();
initLocationsAutocomplete();

// TODO Move to controls file?
const meetButton = document.getElementById("meet");
meetButton.addEventListener("click", getMeetingPoint);
