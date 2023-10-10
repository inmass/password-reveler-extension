document.addEventListener("DOMContentLoaded", function() {
    const urlInput = document.getElementById("urlInput");
    const addButton = document.getElementById("addButton");
    const excludedList = document.getElementById("excludedList");
    const message = document.getElementById("message");
  
    // Load the previously excluded websites from storage and populate the list
    chrome.storage.local.get("excludedWebsites", function(data) {
      const excludedWebsites = data.excludedWebsites || [];
      populateExcludedList(excludedWebsites);
    });
  
    // Add event listener to the button to handle adding URLs to the exclusion list
    addButton.addEventListener("click", function() {
        const url = urlInput.value.trim();
        // if url is not valid, show error message
        if (isValidUrl(url)) {
            const baseUrl = getBaseUrl(url);
            if (baseUrl) {
                // Retrieve the previously excluded websites from storage
                chrome.storage.local.get("excludedWebsites", function(data) {
                    const excludedWebsites = data.excludedWebsites || [];
                    if (!excludedWebsites.includes(baseUrl)) {
                        // Add the URL to the excluded websites list
                        excludedWebsites.push(baseUrl);
            
                        // Save the updated excluded websites list to storage
                        chrome.storage.local.set({ excludedWebsites: excludedWebsites }, function() {
                            // Populate the list with the updated excluded websites
                            populateExcludedList(excludedWebsites);
                        });
                    }
                });
            } else {
                message.textContent = "Invalid URL";
                message.style.color = "red";
            }
        } else {
            message.textContent = "Invalid URL";
            message.style.color = "red";
        }
        // Clear the input field
        urlInput.value = "";
    });
  
    // Function to populate the excluded websites list
    function populateExcludedList(excludedWebsites) {

        
        excludedList.innerHTML = "";
        excludedWebsites.forEach(function(url) {
            // add list with text and delete button
            const li = document.createElement("li");
            const deleteButton = document.createElement("span");
            deleteButton.classList.add("deleteExcludedWebsiteButton");
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>';
            li.appendChild(deleteButton);
            deleteButton.addEventListener("click", function() {
                // Retrieve the previously excluded websites from storage
                chrome.storage.local.get("excludedWebsites", function(data) {
                    const excludedWebsites = data.excludedWebsites || [];
                    // Remove the URL from the excluded websites list
                    const index = excludedWebsites.indexOf(url);
                    if (index > -1) {
                        excludedWebsites.splice(index, 1);
                    }
                    // Save the updated excluded websites list to storage
                    chrome.storage.local.set({ excludedWebsites: excludedWebsites }, function() {
                        // Populate the list with the updated excluded websites
                        populateExcludedList(excludedWebsites);
                    });
                });
            });
            const text = document.createTextNode(url);
            li.appendChild(text);

            excludedList.appendChild(li);
      });
    }

    // Function to validate URL format using regular expressions
    function isValidUrl(url) {
        const pattern = new RegExp(
            "^((https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+)(:[0-9]+)?(\\/\\S*)?)$"
        );
        return pattern.test(url);
    }

    function getBaseUrl(url) {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.origin;
        } catch (error) {
          console.error("Invalid URL format");
          return null;
        }
    }
  });
  