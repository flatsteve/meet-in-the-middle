export const getGeoLocation = new Promise(resolve => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      () => {
        // User may have blocked location
        resolve(null);
      },
      { timeout: 10000 }
    );
  } else {
    resolve(null);
  }
});
