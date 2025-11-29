// Function to create and inject the button
function injectButton() {
    // Check if button already exists
    if (document.querySelector('.spotjump-btn')) return;

    // Target the Like/Dislike button container in the actions bar
    const likeDislikeContainer = document.querySelector('segmented-like-dislike-button-view-model');

    if (likeDislikeContainer && likeDislikeContainer.parentElement) {
        // Ensure the container is actually attached to the DOM to avoid "node is not a child" errors
        if (!likeDislikeContainer.isConnected) {
            // console.log('SpotJump: Like/Dislike container found but not connected to DOM');
            return;
        }

        // console.log('SpotJump: Found Like/Dislike container, injecting button...');

        const btn = document.createElement('button');
        btn.className = 'spotjump-btn';
        btn.title = 'Jump to Spotify';
        // Use a pill shape style to match the actions bar
        btn.innerHTML = `
            <span class="spotjump-icon">
                <svg viewBox="0 0 36 36" width="24" height="24">
                    <path d="M18 0C8.06 0 0 8.06 0 18c0 9.94 8.06 18 18 18s18-8.06 18-18c0-9.94-8.06-18-18-18zm8.26 25.95c-.34.54-1.01.72-1.55.38-4.25-2.59-9.6-3.17-15.91-1.73-.61.13-1.21-.25-1.35-.85-.13-.61.25-1.21.85-1.35 6.95-1.59 12.87-.9 17.57 1.98.54.34.72 1.01.38 1.55zm2.2-4.9c-.43.68-1.31.88-1.98.45-4.97-3.06-12.55-3.94-18.43-2.16-.74.23-1.55-.2-1.78-.94-.23-.74.2-1.55.94-1.78 6.79-2.07 15.34-1.03 21.02 2.45.68.43.88 1.31.45 1.98zm.2-5.2c-5.96-3.53-15.79-3.85-21.49-2.11-.9.27-1.87-.23-2.14-1.15-.27-.9.23-1.87 1.15-2.14 6.61-2.01 17.6-1.62 24.48 2.48.83.5 1.1 1.57.6 2.41-.5.83-1.57 1.1-2.41.6z" fill="currentColor"></path>
                </svg>
            </span>
            <span class="spotjump-text">Jump</span>
        `;

        btn.onclick = jumpToSpotify;

        // Insert after the Like/Dislike container
        try {
            // insertAdjacentElement is safer as it doesn't require manually finding parent and sibling
            likeDislikeContainer.insertAdjacentElement('afterend', btn);
            // console.log('SpotJump: Button injected successfully');
        } catch (e) {
            // console.error('SpotJump: Error injecting button:', e);
        }
    } else {
        // console.log('SpotJump: Like/Dislike container not found yet');
    }
}

// Robust injection loop
let injectionInterval;

function startInjectionLoop() {
    if (injectionInterval) clearInterval(injectionInterval);

    let attempts = 0;
    injectionInterval = setInterval(() => {
        attempts++;
        if (document.querySelector('.spotjump-btn')) {
            clearInterval(injectionInterval);
            return;
        }

        if (attempts > 20) { // Stop after 10 seconds (20 * 500ms)
            clearInterval(injectionInterval);
            // console.log('SpotJump: Gave up injecting button after 10 seconds');
            return;
        }

        injectButton();
    }, 500);
}

// Observe DOM changes to handle navigation (SPA)
const observer = new MutationObserver((mutations) => {
    if (window.location.href.includes('/watch')) {
        if (!document.querySelector('.spotjump-btn')) {
            // Debounce or just let the interval handle it if it's running?
            // Let's just try to inject once per mutation batch if missing
            injectButton();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial check
if (window.location.href.includes('/watch')) {
    // console.log('SpotJump: Initial check started');
    startInjectionLoop();
} else {
    // console.log('SpotJump: Not a watch page');
}

window.addEventListener('yt-navigate-finish', () => {
    // console.log('SpotJump: yt-navigate-finish detected');
    if (window.location.href.includes('/watch')) {
        startInjectionLoop();
    }
});

// Core functionality extracted for reuse
function jumpToSpotify() {
    const currentTitle = document.querySelector('ytd-watch-metadata h1')?.innerText || document.title.replace(' - YouTube', '');
    if (!currentTitle) {
        // console.log('SpotJump: Could not find video title');
        return;
    }
    const cleanTitle = currentTitle.replace(/[\(\[\{].*?[\)\]\}]/g, '').trim();
    const query = encodeURIComponent(cleanTitle);
    window.open(`https://open.spotify.com/search/${query}`, '_blank');
}

// Listen for messages from background script (extension icon click)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "jumpToSpotify") {
        jumpToSpotify();
    }
});
