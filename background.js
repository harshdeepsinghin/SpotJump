// Listen for the extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tab.id, { action: "jumpToSpotify" });
    } else {
        console.log("SpotJump: Not a YouTube video page.");
    }
});
