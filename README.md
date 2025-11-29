# SpotJump

**SpotJump** is a browser extension that bridges the gap between YouTube and Spotify. It allows you to instantly jump from a song on YouTube to Spotify, and vice versa.

## Features

### YouTube to Spotify
- Adds a **"SpotJump"** button next to the Like/Dislike buttons on YouTube video pages.
- Clicking the button searches for the current video title on Spotify.
- Also works by clicking the **SpotJump extension icon** in the browser toolbar.

### Spotify to YouTube
- Adds a **"Jump to YouTube"** button (play icon) next to the "Like" (Heart or Plus) button in the Spotify Web Player (`open.spotify.com`).
- Clicking the button searches for the currently playing song on YouTube.
- Also works by clicking the **SpotJump extension icon** while on Spotify.

## Supported Platforms

- **Web Browsers**:
  - **Chrome / Edge / Brave**: Fully supported (Manifest V3).
  - **Firefox**: Fully supported (Manifest V2).
- **Spotify Web Player**: Works fully on `open.spotify.com`.
- **Spotify PWA**: Works on the "installed" browser version of Spotify (Progressive Web App).
  - *Note: If you install Spotify as a Chrome App/PWA, you may need to reload the app window after installing the extension.*

## Known Limitations

- **Native Desktop Apps**: This extension **CANNOT** work on the standalone Spotify Desktop Application (the `.exe` or `.dmg` file downloaded from Spotify's website or App Store). Browser extensions are strictly limited to the browser environment and cannot modify other programs installed on your computer.

## Installation

1. Clone this repository.
2. Open Chrome/Edge and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the folder containing this extension.

### Firefox

1. Download the `SpotJump-Firefox.zip` from the Releases page (or use the `firefox_dist` folder if building locally).
2. Go to `about:debugging`.
3. Click **"This Firefox"**.
4. Click **"Load Temporary Add-on..."**.
5. Select the `manifest.json` file inside the unzipped folder.
