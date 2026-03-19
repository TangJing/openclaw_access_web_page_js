# Page JS Extension

A Chrome extension that automatically collects page HTML tag structures and supports fast searching and positioning of page elements through keywords.

## Features

- 🚀 **Auto Collection**: Automatically collects all HTML tags after page load
- 🔍 **Keyword Search**: Quickly search elements by id, class, title, innerText
- 📦 **Dual Map Structure**: elementMap stores elements, keywordMap stores keyword mappings
- 🌐 **Global Injection**: Supports automatic injection on all web pages
- 🎯 **Precise Positioning**: Returns references to matched DOM elements

## Project Structure

```
page_js/
├── manifest.json              # Extension config (Manifest V3)
├── background/
│   └── background.js          # Service Worker background script
├── content_scripts/
│   ├── content.js             # Main injection script
│   └── lib/
│       └── element-collector.js  # Element collector core library
├── popup/
│   ├── popup.html             # Popup page
│   ├── popup.css              # Popup styles
│   └── popup.js               # Popup logic
├── styles/
│   └── content.css            # Injected page styles
└── icons/
    ├── icon16.svg             # 16x16 icon
    ├── icon48.svg             # 48x48 icon
    └── icon128.svg            # 128x128 icon
```

## Installation

### Method 1: Developer Mode (Recommended for development)

1. Open Chrome browser, visit `chrome://extensions/`
2. Enable **"Developer mode"** in the top right corner
3. Click **"Load unpacked"**
4. Select the `page_js` project directory
5. Extension installed

### Method 2: Using packed file

1. Download `page_js_extension.zip`
2. Extract to any directory
3. Load the extracted directory as in Method 1

### Icon Conversion (Optional)

Icons in the project are SVG format. For production release, convert to PNG:

```bash
# Using ImageMagick
convert icons/icon16.svg icons/icon16.png
convert icons/icon48.svg icons/icon48.png
convert icons/icon128.svg icons/icon128.png
```

## Usage

### API Reference

The extension provides the following methods on `window.ElementCollector`:

#### `collectAllElements()`
Collect all HTML tags and build index.

```javascript
ElementCollector.collectAllElements();
```

#### `searchElementsByKey(key)`
Search elements by keyword.

```javascript
// Search elements with class containing 'btn'
const btns = ElementCollector.searchElementsByKey('btn');

// Search element with id 'header'
const headers = ElementCollector.searchElementsByKey('header');

// Search elements with text containing 'Login'
const logins = ElementCollector.searchElementsByKey('Login');
```

#### `getElementCount()`
Get the number of collected elements.

```javascript
const count = ElementCollector.getElementCount();
```

#### `getKeywordCount()`
Get the number of indexed keywords.

```javascript
const keywordCount = ElementCollector.getKeywordCount();
```

#### `exportData()`
Export all data (for debugging).

```javascript
const data = ElementCollector.exportData();
console.log(data);
```

#### `clearData()`
Clear all collected data.

```javascript
ElementCollector.clearData();
```

### Data Format

#### elementMap
```
Key format: id|class|title|innerText
- id: Element id attribute
- class: Element class (spaces replaced with |)
- title: Element title attribute
- innerText: Element text content (max 100 chars)
```

Example key: `header|nav|main-menu|Home`

#### keywordMap
```
Keyword -> Set<elementMap keys>
```

## Architecture

- **Manifest V3**: Latest Chrome extension specification
- **Service Worker**: Replaces traditional background page
- **Content Scripts**: Scripts injected into pages
- **Dual Map Index**: O(1) search time complexity

## Notes

1. Some special pages cannot be injected:
   - Pages starting with `chrome://`
   - Pages starting with `chrome-extension://`
   - System pages like new tab, settings, etc.

2. Dynamically loaded content (e.g., after SPA route changes) requires manual call to `collectAllElements()`

3. Icon files need PNG format to display correctly

## Development

```bash
# Clone the project
git clone https://gitee.com/TonyDon/page_js.git

# Enter project directory
cd page_js

# Install dependencies (if any)
npm install

# Reload extension after code changes
# Click refresh button on chrome://extensions/ page
```

## Contributing

1. Fork this repository
2. Create `Feat_xxx` branch
3. Commit your code
4. Create Pull Request

## License

MIT License

## Links

- [Gitee Repository](https://gitee.com/TonyDon/page_js)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
