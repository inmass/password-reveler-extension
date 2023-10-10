chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("[Developer mode passwords] tab updated: ", tabId, changeInfo, tab);
    if (changeInfo.status === 'complete' && tab.active) {
      // Get the current URL
      const currentUrl = tab.url;
    
      // Retrieve the excluded websites from storage
      chrome.storage.local.get('excludedWebsites', function(data) {
        const excludedWebsites = data.excludedWebsites || [];
        console.log("[Developer mode passwords] excludedWebsites: ", excludedWebsites);
        
        // Check if the current URL is in the excluded websites list
        const isBlacklisted = excludedWebsites.some(function(url) {
          return currentUrl.includes(url);
        });
    
        if (!isBlacklisted) {
            // The DOM of the current active tab is loaded
            chrome.tabs.sendMessage(tabId, { command: "tabDOMContentLoaded" });
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { command: "setInitialState" });
            }, 2000);
        }
      });
    }
  });