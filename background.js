// Listen for the extension icon click
// Support both MV3 (action) and MV2 (browserAction)
const action = chrome.action || chrome.browserAction;
action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tab.id, { action: "jumpToSpotify" });
    } else if (tab.url && tab.url.includes("open.spotify.com")) {
        // Send a message to the Spotify content script
        chrome.tabs.sendMessage(tab.id, { action: "jumpToYouTube" });
    } else {
        // console.log("SpotJump: Not a supported page.");
    }
});
