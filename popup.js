document.addEventListener("DOMContentLoaded", function() {
    
    function alertManifest(element)
    {
        if (element.checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // Send a message to the content script
                chrome.tabs.sendMessage(tabs[0].id, { command: "showPasswords" });
            });
        }
        else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // Send a message to the content script
                chrome.tabs.sendMessage(tabs[0].id, { command: "hidePasswords" });
            });
        }
    }

    function setInitialState() {
        chrome.storage.local.get("showHideCheckbox", function (result) {
            if (result.showHideCheckbox === true) {
                document.getElementById("showHideCheckbox").checked = true;
            }
        });
    }

    // get the state of the checkbox from storage
    setInitialState();

    const showHideCheckbox = document.getElementById("showHideCheckbox");

    showHideCheckbox.addEventListener("click", function () {
        alertManifest(showHideCheckbox);
        // save the state of the checkbox to local storage
        chrome.storage.local.set({ "showHideCheckbox": showHideCheckbox.checked });
    });

});