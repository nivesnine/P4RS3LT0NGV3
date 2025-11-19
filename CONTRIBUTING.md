# Contributing to P4RS3LT0NGV3

Thank you for your interest in contributing! This guide will help you understand the project structure and how to add new features.

## 📁 Project Structure

```
P4RS3LT0NGV3/
├── js/
│   ├── app.js              # Main Vue.js application entry point
│   ├── core/                # Core feature modules (shared libraries)
│   │   ├── decoder.js      # Universal decoder
│   │   ├── steganography.js # Steganography encoding/decoding
│   │   └── emojiLibrary.js  # Emoji library functions
│   ├── data/                # Generated/static data files
│   │   ├── emojiData.js     # Generated emoji data
│   │   └── emojiCompatibility.js
│   ├── bundles/             # Build-generated files
│   │   └── transforms-bundle.js
│   ├── config/              # Configuration constants
│   │   └── constants.js
│   ├── utils/               # Utility functions
│   │   ├── escapeParser.js
│   │   ├── focus.js
│   │   ├── history.js
│   │   ├── notifications.js
│   │   └── theme.js
│   └── tools/               # Tool registry system (Vue integration)
│       ├── Tool.js          # Base class
│       ├── TransformTool.js
│       ├── DecodeTool.js
│       ├── EmojiTool.js
│       └── index.js          # Tool registry
├── src/
│   └── transformers/        # Transformer modules (source)
│       ├── BaseTransformer.js
│       ├── base-encodings/
│       ├── ciphers/
│       ├── fantasy/
│       └── ...
├── build/                   # Build scripts
│   ├── build-transforms.js
│   └── build-emoji-data.js
├── tests/                   # Test suites
│   ├── test_universal.js
│   └── test_steganography_options.js
└── docs/                    # Documentation
```

## 🎯 Key Concepts

### Core vs Tools

- **`js/core/`** - Shared business logic libraries used by multiple tools
  - These are **NOT** tool-specific
  - Examples: `decoder.js` (used by DecodeTool + app.js), `steganography.js` (used by EmojiTool + decoder.js)
  
- **`js/tools/`** - Vue.js integration layer for UI features
  - Each tool represents a tab/feature in the UI
  - Tools use core modules for functionality
  - Example: `DecodeTool.js` uses `window.universalDecode` from `core/decoder.js`

### Transformers vs Tools

- **Transformers** (`src/transformers/`) - Text transformation logic (encoding/decoding)
- **Tools** (`js/tools/`) - UI features/tabs (Transform tab, Decoder tab, Emoji tab)

## 🚀 Getting Started

### Prerequisites

- Node.js (for running tests and builds)
- Modern web browser (for testing)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd P4RS3LT0NGV3

# Install dependencies (if any)
npm install

# Build transformers bundle
npm run build

# Run tests
npm test
```

## ✨ Adding New Features

### 1. Adding a New Transformer

Transformers are the core text transformation logic. See `src/transformers/README.md` for detailed instructions.

**Quick Start:**

1. Create a new file in the appropriate category directory:
   ```bash
   src/transformers/ciphers/my-cipher.js
   ```

2. Use the `BaseTransformer` class:
   ```javascript
   import BaseTransformer from '../BaseTransformer.js';
   
   export default new BaseTransformer({
       name: 'My Cipher',
       priority: 60,              // See priority guide in transformers/README.md
       category: 'ciphers',
       func: function(text) {
           // Encoding logic
           return encoded;
       },
       reverse: function(text) {
           // Decoding logic
           return decoded;
       },
       detector: function(text) {
           // Optional: pattern detection for universal decoder
           return /pattern/.test(text);
       }
   });
   ```

3. Rebuild the bundle:
   ```bash
   npm run build
   ```

4. Test it:
   - Open `index.html` in a browser
   - Your transformer will appear in the Transform tab automatically
   - Test encoding/decoding
   - Test with the Universal Decoder

5. Add tests (optional but recommended):
   - Add test cases to `tests/test_universal.js`
   - Run `npm test` to verify

**Important:** Transformers are automatically discovered and bundled. No manual registration needed!

### 2. Adding a New Tool (New Tab/Feature)

Tools represent UI features/tabs. Examples: Transform tab, Decoder tab, Emoji tab.

**Steps:**

1. Create a new tool class in `js/tools/`:
   ```javascript
   // js/tools/MyNewTool.js
   class MyNewTool extends Tool {
       constructor() {
           super({
               id: 'myfeature',        // Unique ID (used for tab switching)
               name: 'My Feature',     // Display name
               icon: 'fa-star',        // Font Awesome icon class
               title: 'My Feature (M)', // Tooltip with keyboard shortcut
               order: 5                // Display order (lower = earlier)
           });
       }
       
       getVueData() {
           return {
               // Vue data properties for this tool
               myInput: '',
               myOutput: ''
           };
       }
       
       getVueMethods() {
           return {
               // Vue methods for this tool
               doSomething: function() {
                   // Your logic here
               }
           };
       }
       
       getTabContentHTML() {
           return `
               <!-- HTML template for this tool's tab -->
               <div class="my-feature-layout">
                   <textarea v-model="myInput"></textarea>
                   <div>{{ myOutput }}</div>
               </div>
           `;
       }
   }
   ```

2. Register the tool in `js/tools/index.js`:
   ```javascript
   // Import your tool
   import MyNewTool from './MyNewTool.js';
   
   // Register it (tools are auto-registered if imported)
   // The ToolRegistry will discover it automatically
   ```

3. Add script tag to `index.html` (before `app.js`):
   ```html
   <script src="js/tools/MyNewTool.js"></script>
   ```

4. Test it:
   - Open `index.html`
   - Your new tab should appear automatically
   - Test all functionality

**See `js/tools/Tool.js` for the base class API and `js/tools/TransformTool.js` for a complete example.**

### 3. Adding a New Utility Function

Utilities are shared helper functions used across the app.

**Steps:**

1. Create a new utility file in `js/utils/`:
   ```javascript
   // js/utils/myUtility.js
   window.MyUtility = {
       doSomething: function(param) {
           // Your utility function
           return result;
       }
   };
   ```

2. Add script tag to `index.html` (in the utilities section):
   ```html
   <script src="js/utils/myUtility.js"></script>
   ```

3. Use it in your code:
   ```javascript
   window.MyUtility.doSomething(value);
   ```

**Guidelines:**
- Keep utilities pure (no side effects when possible)
- Use `window` namespace for browser compatibility
- Document with JSDoc comments

### 4. Adding Configuration Constants

Configuration values go in `js/config/constants.js`.

**Steps:**

1. Add your constant:
   ```javascript
   window.CONFIG = {
       // ... existing constants
       MY_NEW_CONSTANT: 100
   };
   ```

2. Use it:
   ```javascript
   const value = window.CONFIG.MY_NEW_CONSTANT;
   ```

**Guidelines:**
- Use constants for magic numbers
- Use descriptive names in UPPER_SNAKE_CASE
- Add comments explaining what the constant is for

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:universal      # Universal decoder tests
npm run test:steg           # Steganography options tests
```

### Writing Tests

- **Transformer tests**: Add to `tests/test_universal.js`
  - Tests are automatically discovered
  - Add limitations/expected behavior to the `limitations` object if needed
  
- **Steganography tests**: Add to `tests/test_steganography_options.js`
  - Tests encoding/decoding round-trips with various option combinations

- **New test files**: Create in `tests/` directory
  - Use `path.resolve(__dirname, '..')` to get project root
  - Use `path.join(projectRoot, '...')` for file paths

## 📝 Code Style

### JavaScript

- Use ES6+ features (arrow functions, const/let, template literals)
- Use meaningful variable names
- Add JSDoc comments for public functions
- Follow existing code style in the file you're editing

### File Organization

- **Core modules** (`js/core/`) - Shared business logic
- **Tools** (`js/tools/`) - Vue.js UI integration
- **Utils** (`js/utils/`) - Helper functions
- **Config** (`js/config/`) - Configuration constants
- **Transformers** (`src/transformers/`) - Text transformation logic

### Naming Conventions

- **Files**: `camelCase.js` for utilities/tools, `kebab-case.js` for transformers
- **Classes**: `PascalCase` (e.g., `DecodeTool`)
- **Functions**: `camelCase` (e.g., `runUniversalDecode`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_HISTORY_ITEMS`)

## 🔧 Build Process

### Building Transformers

```bash
npm run build
```

This:
1. Discovers all transformers in `src/transformers/`
2. Bundles them into `js/bundles/transforms-bundle.js`
3. Makes them available as `window.transforms`

### Building Emoji Data

```bash
npm run build:emoji
```

This:
1. Fetches latest emoji data from Unicode
2. Generates `js/data/emojiData.js`

### Full Build

```bash
npm run build:all
```

Runs both emoji and transformer builds.

## 🐛 Debugging

### Common Issues

1. **Transformer not appearing**: Run `npm run build` to rebuild the bundle
2. **Tool not showing**: Check that script tag is in `index.html` before `app.js`
3. **Tests failing**: Check file paths use `path.join(projectRoot, '...')`

### Browser Console

- Open browser DevTools (F12)
- Check console for errors
- Use `window.transforms` to see all transformers
- Use `window.steganography` to access steganography functions
- Use `window.emojiLibrary` to access emoji functions

## 📚 Documentation

- **Project README**: `README.md` - Overview and user guide
- **JS Structure**: `js/README.md` - JavaScript file organization
- **Transformers**: `src/transformers/README.md` - How to add transformers
- **Tests**: `tests/README.md` - Test suite documentation
- **Code Review**: `docs/CODE_REVIEW.md` - Architecture details

## ✅ Checklist Before Submitting

- [ ] Code follows existing style
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tested in browser (open `index.html`)
- [ ] No console errors
- [ ] Documentation updated (if needed)
- [ ] JSDoc comments added (for new functions)

## 🤝 Questions?

- Check existing code for examples
- Review `docs/CODE_REVIEW.md` for architecture details
- Look at similar features to understand patterns

Thank you for contributing! 🎉

