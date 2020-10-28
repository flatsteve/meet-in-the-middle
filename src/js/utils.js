import { placeResults } from "../../__fixtures__/places";
import { renderPlaces } from "./places";
import { showMiddlePointAndPlaces } from "./map";

export function scrollTop(topPosition) {
  window.scrollTo({ top: topPosition, left: 0, behavior: "smooth" });
}

export function removeElement(element) {
  element.parentElement.removeChild(element);
}

export function showFixtureData() {
  let bounds = new google.maps.LatLngBounds();

  bounds.extend({
    lat: 51.4788628,
    lng: -0.0267169,
  });

  const middlePointLatLng = bounds.getCenter();

  showMiddlePointAndPlaces({ middlePointLatLng, showPlaces: false });
  renderPlaces(placeResults);
}
