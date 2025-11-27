// Function to create and inject the button
function injectSpotifyButton() {
    // Check if button already exists
    if (document.querySelector('.spotjump-yt-btn')) return;

    // Target the Like/Heart button in the Now Playing footer
    // Spotify's class names are obfuscated, so we look for the button with specific aria-label or testid
    // Common selector for the "Now Playing" widget's right side (where the heart is)
    // We can try to find the heart button directly.
    const likeBtn = document.querySelector('button[data-testid="add-button"]') || document.querySelector('button[aria-label="Save to Your Library"]') || document.querySelector('button[aria-label="Remove from Your Library"]');

    if (likeBtn && likeBtn.parentElement) {
        console.log('SpotJump: Found Like button, injecting YouTube button...');

        const btn = document.createElement('button');
        btn.className = 'spotjump-yt-btn';
        btn.title = 'Jump to YouTube';
        btn.innerHTML = `
            <span class="spotjump-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            </span>
        `;

        btn.onclick = jumpToYouTube;

        // Insert after the Like button
        likeBtn.insertAdjacentElement('afterend', btn);
        console.log('SpotJump: YouTube button injected successfully');
    } else {
        // console.log('SpotJump: Like button not found yet');
    }
}

function jumpToYouTube() {
    // Extract song info
    // Spotify title is usually in a link with data-testid="context-item-link" inside the now-playing widget
    // Or aria-label="Now playing: Song Name by Artist" on the footer? No.

    // Try to get title and artist from the Now Playing widget
    const nowPlayingWidget = document.querySelector('div[data-testid="now-playing-widget"]');
    if (!nowPlayingWidget) {
        console.log('SpotJump: Now playing widget not found');
        return;
    }

    const trackNameElement = nowPlayingWidget.querySelector('div[data-testid="context-item-info-title"] a') || nowPlayingWidget.querySelector('a[data-testid="context-item-link"]');
    const artistNameElement = nowPlayingWidget.querySelector('div[data-testid="context-item-info-subtitles"] a') || nowPlayingWidget.querySelector('div[data-testid="context-item-info-artist"] a');

    let query = '';
    if (trackNameElement) {
        query += trackNameElement.innerText;
    }
    if (artistNameElement) {
        query += ' ' + artistNameElement.innerText;
    }

    // Fallback: document title usually has "Song - Artist"
    if (!query.trim()) {
        query = document.title.replace(' - Spotify', '');
    }

    if (!query.trim()) {
        console.log('SpotJump: Could not extract song info');
        return;
    }

    console.log('SpotJump: Searching YouTube for:', query);
    const encodedQuery = encodeURIComponent(query.trim());
    window.open(`https://www.youtube.com/results?search_query=${encodedQuery}`, '_blank');
}

// Injection loop
let injectionInterval;
function startInjectionLoop() {
    if (injectionInterval) clearInterval(injectionInterval);
    injectionInterval = setInterval(() => {
        if (document.querySelector('.spotjump-yt-btn')) {
            // Check if it's still connected (Spotify re-renders a lot)
            if (!document.querySelector('.spotjump-yt-btn').isConnected) {
                injectSpotifyButton();
            }
        } else {
            injectSpotifyButton();
        }
    }, 1000);
}

// Start
startInjectionLoop();

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "jumpToYouTube") {
        jumpToYouTube();
    }
});
