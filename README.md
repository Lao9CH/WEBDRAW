# Web Canvas Chrome Extension

A professional web annotation tool with drawing capabilities for Chrome browser.

## Features

- Free-hand drawing with smooth lines
- Eraser tool
- Responsive canvas that adapts to window size
- Works on any webpage
- Professional drawing experience with perfect-freehand library

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Development

- Run development build with watch mode:
  ```bash
  npm run dev
  ```

## Usage

1. Click the Web Canvas icon in your Chrome toolbar
2. Use the drawing tools to annotate any webpage
3. Choose different tools and colors from the toolbar
4. Draw freely on any webpage

## Tech Stack

- Chrome Extension Manifest V3
- perfect-freehand library for smooth drawing
- Webpack for building
- Modern JavaScript (ES6+)

## License

MIT
