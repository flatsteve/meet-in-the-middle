export const CENTRAL_LND_COORDS = { lat: 51.515419, lng: -0.141099 };
export const TABLET_WIDTH = 768;
export const PLACE_IMG_WIDTH = 512;
export const PLACE_SEARCH_RADIUS = "500";
export const MIN_ZOOM_LEVEL = 15;

export const MAP_CONFIG = {
  center: CENTRAL_LND_COORDS,
  mapTypeControl: false,
  gestureHandling: "greedy",
  fullscreenControl: false,
  streetViewControl: false,
  zoom: 12,
  styles: [
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#f5f5f5"
        }
      ]
    },
    {
      featureType: "poi.attraction",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.government",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.medical",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.place_of_worship",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.school",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.sports_complex",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#b9d6f2"
        }
      ]
    }
  ]
};
