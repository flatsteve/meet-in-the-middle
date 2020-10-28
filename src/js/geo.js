export const getGeoLocation = new Promise((resolve, reject) => {
  const TEN_SECONDS = 10000;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      () => {
        // User may have blocked location
        reject("Please enabled location to use this feature.");
      },
      { timeout: TEN_SECONDS }
    );
  } else {
    reject("Geolocation not available.");
  }
});
