export function validateLocationsForm({ event, inputs }) {
  Object.keys(inputs).forEach(inputKey => {
    if (!inputs[inputKey].element.value) {
      inputs[inputKey].element.classList.add("input--invalid");
      return;
    }

    if (!inputs[inputKey].coordinates) {
      console.log(`No coords in ${inputKey}`);
    }
  });
}
