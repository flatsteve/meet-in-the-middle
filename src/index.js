import * as Sentry from "@sentry/browser";

import { initMap } from "./js/map";
import { initLocationsAutocomplete } from "./js/locations";
import { initPlacesService } from "./js/places";
// import { showFixtureData } from "./js/utils";

import "./styles.scss";

if (module.hot) {
  module.hot.accept();
}

if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
  }

  Sentry.init({
    dsn: "https://7ae9bb187a1d448d9e35c83704c37433@sentry.io/1454083"
  });
}

export const map = initMap();
initPlacesService();
initLocationsAutocomplete();
// showFixtureData();
