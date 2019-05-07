import * as Sentry from "@sentry/browser";

import { initMap } from "./js/map";
import { initLocationsAutocomplete } from "./js/locations";
import { initPlacesService, testPlaces } from "./js/places";

import "./styles.scss";

if (module.hot) {
  module.hot.accept();
}

Sentry.init({
  dsn: "https://7ae9bb187a1d448d9e35c83704c37433@sentry.io/1454083"
});

export const map = initMap();
initPlacesService();
initLocationsAutocomplete();
testPlaces();
