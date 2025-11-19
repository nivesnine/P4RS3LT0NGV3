# JavaScript Directory Structure

## Current Organization

### Top-Level Files
- **`app.js`** - Main Vue.js application entry point (stays at root)

### Core Modules (`js/core/`)
Core feature modules that provide main functionality:
- `decoder.js` - Universal decoder for automatic encoding detection
- `steganography.js` - Emoji and invisible text steganography
- `emojiLibrary.js` - Emoji search, filtering, and library functions

### Data Files (`js/data/`)
Generated or static data files:
- `emojiData.js` - Generated emoji data from Unicode
- `emojiCompatibility.js` - Emoji compatibility mappings

### Generated Files (`js/bundles/` or root)
Build-generated files:
- `transforms-bundle.js` - Bundled transformer modules

### Subdirectories
- **`config/`** - Configuration constants
- **`utils/`** - Utility functions
- **`tools/`** - Tool registry system

## Load Order (in index.html)

1. Data files (emojiData, emojiCompatibility)
2. Generated bundles (transforms-bundle)
3. Configuration (constants)
4. Utilities (escapeParser, focus, notifications, history, theme)
5. Core modules (steganography, decoder, emojiLibrary)
6. Tool system (Tool.js, TransformTool.js, etc.)
7. Main app (app.js)


