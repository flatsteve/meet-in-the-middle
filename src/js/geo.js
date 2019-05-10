export const getGeoLocation = new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      () => {
        // User may have blocked location
        reject("Please enabled location to use this feature.");
      },
      { timeout: 10000 }
    );
  } else {
    reject("Geolocation not available.");
  }
});
