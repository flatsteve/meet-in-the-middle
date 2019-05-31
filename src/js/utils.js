import { placeResults } from "../../__fixtures__/places";
import { renderPlaces } from "./places";
import { showMiddlePoint } from "./map";

export function showFixtureData() {
  let bounds = new google.maps.LatLngBounds();

  bounds.extend({
    lat: 51.4788628,
    lng: -0.0267169
  });

  showMiddlePoint({ bounds, showPlaces: false });
  renderPlaces(placeResults);
}
