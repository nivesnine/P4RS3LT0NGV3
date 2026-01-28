# Art Styles

Art styles are pluggable ASCII art generators for the ASCII Art tool. Each art style defines how text is converted into ASCII art, and can include custom options for user configuration.

## Creating a New Art Style

Create a new `.js` file in this directory following this pattern:

```javascript
import BaseArtStyle from './BaseArtStyle.js';

export default new BaseArtStyle({
    name: 'My Style Name',
    description: 'Brief description of the style',
    func: function(text, options) {
        // Generate ASCII art from text
        // options contains user-selected values from customOptions
        return asciiArtString;
    },
    customOptions: [
        {
            name: 'width',
            label: 'Characters Per Line',
            type: 'number',
            default: 5,
            min: 1,
            max: 20,
            description: 'Controls output width'
        },
        {
            name: 'style',
            label: 'Style Variant',
            type: 'select',
            default: 'standard',
            options: [
                { value: 'standard', label: 'Standard' },
                { value: 'bold', label: 'Bold' }
            ]
        }
    ]
});
```

## Custom Options

Art styles can define custom options that appear as form controls in the UI:

### Option Types

- **`number`**: Numeric input with min/max validation
- **`text`**: Text input field
- **`select`**: Dropdown with predefined options

### Option Properties

- `name` (required): Internal identifier (used in `options` object)
- `label` (required): Display label in UI
- `type` (required): One of `'number'`, `'text'`, or `'select'`
- `default` (optional): Default value
- `description` (optional): Help text shown below the input
- `min`/`max` (optional): For `number` type, validation bounds
- `options` (required for `select`): Array of `{value, label}` objects

## Function Signature

The `func` method receives:
- `text` (string): The input text to convert
- `options` (object): User-selected values keyed by option `name`

The function should return a string containing the ASCII art.

## Examples

See `standard.js` and `bold.js` for complete examples.

## Building

Art styles are automatically bundled when you run:
```bash
npm run build:artstyles
```

Or as part of the full build:
```bash
npm run build
```

The bundle is created at `dist/js/bundles/artstyles-bundle.js` and loaded automatically by the ASCII Art tool.

