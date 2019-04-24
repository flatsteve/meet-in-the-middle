import { initMap } from "./map";
import { getMeetingPoint } from "./locations";

if (module.hot) {
  module.hot.accept();
}

window.initMap = initMap;

const meetButton = document.getElementById("meet");

meetButton.addEventListener("click", getMeetingPoint);
