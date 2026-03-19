# Page JS Extension

A Chrome extension designed for **AI large model web page operations**. Automatically collects all DOM elements and builds keyword indexes. Through CDP (Chrome DevTools Protocol), AI can complete page automation with **minimal token consumption**, saving 95%+ tokens.

## 🎯 Core Purpose

### Problem Solved

Traditional AI web operations require sending complete DOM (thousands of lines of HTML), consuming大量 tokens. This extension localizes DOM indexing, so AI only needs to send keywords to complete operations, **saving 95%+ tokens**.

### Use Cases

- ✅ AI assistant automated web operations (click, fill, select, etc.)
- ✅ Browser automation testing
- ✅ RPA (Robotic Process Automation)
- ✅ Web data collection

### Typical Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  AI Model   │────▶│  CDP/Console │────▶│ Plugin API  │
│ (generate)  │     │  (execute)   │     │ (position)  │
└─────────────┘     └──────────────┘     └─────────────┘
       ▲                                        │
       │                                        ▼
       │                              ┌─────────────┐
       └──────────────────────────────│  Result    │
                                      └─────────────┘
```

---

## 🚀 Features

- **🤖 AI Friendly**: Designed for large models, minimizes token consumption
- **🔍 Keyword Search**: Search by id, class, title, innerText, aria-label
- **⚡ High Performance**: Dual Map index structure, O(1) lookup time
- **🌐 Global Injection**: Supports all web pages (`<all_urls>`)
- **📦 Local Index**: DOM structure stored locally, no need to send to AI
- **🎯 Precise Positioning**: Returns real DOM references for direct manipulation

---

## 📦 Installation

### Method 1: Developer Mode (Recommended)

1. Open Chrome browser, visit `chrome://extensions/`
2. Enable **"Developer mode"** in the top right corner
3. Click **"Load unpacked"**
4. Select the `page_js` project directory
5. Extension installed

### Method 2: Using Packed File

1. Download `page_js_extension.zip`
2. Extract to any directory
3. Load the extracted directory as in Method 1

---

## 🔧 Usage

### Option 1: With CDP (Recommended for AI Automation)

Execute plugin API remotely via Chrome DevTools Protocol:

```python
# Python example using pychrome
import pychrome

# Connect to Chrome DevTools
browser = pychrome.Browser(url="http://127.0.0.1:9222")
tab = browser.new_tab()
tab.start()

# Enable Runtime domain
tab.Runtime.enable()

# Execute plugin API
result = tab.Runtime.evaluate(expression="""
    const results = ElementCollector.searchElementsByKey('login');
    const btn = Object.values(results)[0];
    if (btn) {
        btn.click();
        return { success: true };
    }
    return { success: false };
""")

print(result)
tab.close()
```

### Option 2: Chrome Console (Manual Debugging)

Press `F12` to open console on target page:

```javascript
// Search and click login button
const results = ElementCollector.searchElementsByKey('login');
const btn = Object.values(results)[0];
if (btn) btn.click();

// Fill input field
const userField = ElementCollector.searchElementsByKey('username');
Object.values(userField)[0].value = 'admin';
```

### Option 3: Browser Automation Framework

```javascript
// Puppeteer example
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  // Wait for plugin injection
  await page.waitForFunction(() => window.ElementCollector);
  
  // Execute operation
  await page.evaluate(() => {
    const btns = ElementCollector.searchElementsByKey('submit');
    const btn = Object.values(btns)[0];
    if (btn) btn.click();
  });
  
  await browser.close();
})();
```

---

## 📖 API Reference

### Global Object: `window.ElementCollector`

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `collectAllElements()` | none | `number` | Collect all page elements, return count |
| `searchElementsByKey(key)` | `key: string` | `Object` | Search elements, returns `{key: DOM}` object |
| `getElementCount()` | none | `number` | Get number of collected elements |
| `getKeywordCount()` | none | `number` | Get number of indexed keywords |
| `exportData()` | none | `Object` | Export all data (for debugging) |
| `clearData()` | none | `void` | Clear all collected data |

### Return Value Format

`searchElementsByKey(key)` returns an object:
```javascript
{
  "header|nav||": <DOM Element>,
  "btn|primary||Login": <DOM Element>,
  ...
}
```

**Usage:**
```javascript
const results = ElementCollector.searchElementsByKey('btn');
const firstElement = Object.values(results)[0];  // Get first element
firstElement.click();  // Direct manipulation
```

### Shortcut Commands (Console Only)

```javascript
$search('login')     // Search elements
$collect()           // Re-collect
$elements()          // View element count
```

---

## 💡 AI Operation Examples

### Login Operation
```javascript
// AI generated code
const users = ElementCollector.searchElementsByKey('username');
const pwds = ElementCollector.searchElementsByKey('password');
const btns = ElementCollector.searchElementsByKey('login');

Object.values(users)[0].value = 'admin';
Object.values(pwds)[0].value = '123456';
Object.values(btns)[0].click();
```

### Form Filling
```javascript
// Fill search form
const searchInput = ElementCollector.searchElementsByKey('search');
const searchBtn = ElementCollector.searchElementsByKey('search');

Object.values(searchInput)[0].value = 'keyword';
Object.values(searchBtn)[0].click();
```

### Dropdown Selection
```javascript
// Select dropdown option
const selects = ElementCollector.searchElementsByKey('country');
const select = Object.values(selects)[0];
select.value = 'CN';
select.dispatchEvent(new Event('change'));
```

---

## 🏗️ Architecture

### Data Structures

```
elementMap: Map<key, Element>
  key format: id|class|title|innerText|aria-label
  
keywordMap: Map<keyword, Set<keys>>
  Inverted index, O(1) lookup
```

### Components

| Component | Description |
|-----------|-------------|
| `element-collector.js` | Core library, injected into MAIN world |
| `content.js` | Message forwarding, ISOLATED world |
| `background.js` | Service Worker, extension lifecycle management |
| `popup/` | Extension popup (optional) |

---

## ⚠️ Notes

### Unsupported Pages
- Pages starting with `chrome://`
- Pages starting with `chrome-extension://`
- New tab, settings, and other system pages

### Dynamic Content
Re-collect after SPA route changes:
```javascript
ElementCollector.collectAllElements();
```

### Element Identification
Ensure elements have at least one of these attributes to be indexed:
- `id`
- `class`
- `title`
- `innerText` (text content)
- `aria-label` (accessibility label)

---

## 📦 Development

```bash
# Clone the project
git clone https://github.com/TangJing/openclaw_access_web_page_js.git
cd page_js

# Install test dependencies
npm install

# Run tests
npm test

# After code changes
# Click refresh button on chrome://extensions/ page
```

---

## 📊 Token Savings Comparison

| Operation | Traditional | This Plugin | Savings |
|-----------|-------------|-------------|---------|
| Click button | ~5000 tokens | ~100 tokens | 98% |
| Form filling | ~8000 tokens | ~200 tokens | 97.5% |
| Page navigation | ~5000 tokens | ~150 tokens | 97% |
| **Average** | | | **~95%+** |

---

## 📄 License

MIT License

## 🔗 Links

- [GitHub Repository](https://github.com/TangJing/openclaw_access_web_page_js)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
