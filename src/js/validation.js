function renderError({ element, errorMessage }) {
  if (!element.nextElementSibling.classList.contains("input__error")) {
    return;
  }

  element.nextElementSibling.innerHTML = errorMessage;
}

function resetError({ element }) {
  if (!element.nextElementSibling.classList.contains("input__error")) {
    return;
  }

  element.nextElementSibling.innerHTML = "";
}

export function validateLocationsForm({ inputs }) {
  let hasError = false;

  Object.keys(inputs).forEach((inputKey) => {
    const input = inputs[inputKey];

    if (!input.element.value) {
      input.element.classList.add("input--invalid");

      renderError({
        element: input.element,
        errorMessage: "A location is required",
      });

      hasError = true;
      return;
    }

    if (!input.coordinates) {
      renderError({
        element: input.element,
        errorMessage: "No coordinates found",
      });

      hasError = true;
      return;
    }

    // No errors found
    input.element.classList.remove("input--invalid");
    resetError({ element: input.element });
  });

  return hasError;
}
