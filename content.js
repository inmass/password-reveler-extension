let passwordFields;
let documentLoaded = false;

function updateInputs(inputs, type) {
  for (let i = 0; i < inputs.length; i++) {
    // inputs[i].type = type;
    inputs[i].setAttribute('type', type);
  }
}

function setInitialState(passwordFields) {
  // const showHideCheckboxState = localStorage.getItem("showHideCheckbox");
  chrome.storage.local.get("showHideCheckbox", function (result) {
    if (result.showHideCheckbox === true) {
      updateInputs(passwordFields, "text");
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  // initialize inputs 
  if (request.command === "tabDOMContentLoaded") {
    console.log("[Password Revealer] injected into ", window.location.origin);
    passwordFields = document.querySelectorAll('input[type="password"]');
    documentLoaded = true;
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (!documentLoaded) {
    return;
  }

  if (request.command === "setInitialState") {
    setInitialState(passwordFields);
  }
  else if (request.command === "showPasswords") {
    updateInputs(passwordFields, "text");
  } else if (request.command === "hidePasswords") {
    updateInputs(passwordFields, "password");
  }
});

// watch if new password fields are added to the DOM
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
        updateInputs(passwordFields, "password");
        passwordFields = document.querySelectorAll('input[type="password"]');
        setInitialState(passwordFields);
      }
    }
  });
});