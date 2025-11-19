# Transformers Directory

All text transformers now use the `BaseTransformer` class for consistency and ease of maintenance.

## Directory Structure

```
js/transformers/
├── BaseTransformer.js          # Base class (don't modify)
├── base-encodings/             # Base64, Hex, Binary, etc.
├── ciphers/                    # ROT13, Caesar, Atbash, etc.
├── unicode-styles/             # Cursive, Medieval, Monospace, etc.
├── text-formatting/            # Snake case, Kebab case, etc.
├── languages/                  # Morse, Braille, NATO, etc.
├── fantasy/                    # Elder Futhark, Tengwar, Klingon, etc.
├── symbols/                    # Emoji speak, Hieroglyphics, etc.
└── special/                    # Brainfuck, Invisible text, etc.
```

## Adding a New Transformer

### Simple Character Map Transformer (Auto-generates reverse)

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'My Style',
    priority: 85,           // See priority guide below
    category: 'unicode-styles',
    map: {
        'a': 'α', 'b': 'β', 'c': 'γ',
        // ... more mappings
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    }
    // reverse is auto-generated from map!
});
```

### Custom Transformer with Manual Reverse

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'My Cipher',
    priority: 60,
    category: 'ciphers',
    func: function(text) {
        // Your encoding logic
        return encoded;
    },
    reverse: function(text) {
        // Your decoding logic
        return decoded;
    }
});
```

### Transformer with Custom Detector (Universal Decoder Integration)

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'My Format',
    priority: 285,
    category: 'special',
    
    // Custom detector - returns true if input looks like this format
    detector: function(text) {
        // Check for specific patterns, prefixes, character sets, etc.
        return text.startsWith('MYFORMAT:') && /^MYFORMAT:[A-Z0-9]+$/.test(text);
    },
    
    func: function(text) {
        return 'MYFORMAT:' + text.toUpperCase().replace(/\s/g, '');
    },
    
    reverse: function(text) {
        if (!text.startsWith('MYFORMAT:')) return text;
        return text.substring(9); // Remove prefix
    }
});
```

**How detectors work:**
- The universal decoder automatically calls `detector(text)` on all transformers with this function
- If `detector` returns `true`, it decodes using your `reverse` function
- Uses the transformer's `priority` value to sort results
- Most transformers (33+) now have custom detectors for accurate auto-detection
- Great for formats with unique prefixes, patterns, or exclusive character sets

### Encoding-Only Transformer (No Reverse)

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Random Mix',
    priority: 0,
    category: 'special',
    canDecode: false,       // Explicitly mark as non-reversible
    func: function(text) {
        // Your encoding logic
        return randomized;
    }
});
```

## Priority Guide

Priority determines result ordering when multiple decodings are possible.
Higher priority = more specific/exclusive pattern.

| Priority | Category | Examples | Why |
|----------|----------|----------|-----|
| 310 | Most Exclusive | Semaphore Flags | Only 8 specific arrow emojis |
| 300 | Exclusive Sets | Binary, Morse, Braille, Brainfuck, Tap Code | Can't be anything else |
| 290 | Hex | Hexadecimal | Overlaps with Base32/64 but highly specific |
| 285 | Pattern-Based | Pig Latin, Dovahzul | Distinctive multi-char patterns |
| 280 | Base32 | Base32 | Overlaps with Base64 |
| 270-275 | Base Encodings | Base64, Base58, Base45 | Common but overlapping |
| 260 | Numbers | A1Z26 | Could be other numeric formats |
| 100 | Fantasy Scripts | Elder Futhark, Tengwar, Klingon | Unique Unicode ranges |
| 85 | Unicode Styles | Cursive, Medieval, Monospace | Specific Unicode blocks |
| 70 | Symbols/Ancient | Hieroglyphics, Ogham, Chemical | Less common Unicode |
| 60 | Ciphers | ROT13, Caesar | Letter-only transformations |
| 40 | Text Formatting | URL Encode, HTML Entities | Common patterns |
| 20 | Generic | Default for transforms with reverse | Low confidence |
| 10 | Very Generic | Fallback loop | Last resort |
| 1 | Lowest | Invisible Text | High false positive risk |

## Custom Properties

You can add any custom properties to the config - they'll be preserved:

```javascript
export default new BaseTransformer({
    name: 'My Encoding',
    priority: 290,
    category: 'base-encodings',
    alphabet: 'ABCDEFG123456',  // Custom property!
    func: function(text) {
        // Can access this.alphabet here
        return text.split('').map(c => this.alphabet[c.charCodeAt(0) % this.alphabet.length]).join('');
    },
    reverse: function(text) {
        // this.alphabet is available here too
    }
});
```

## After Adding a Transformer

1. Place file in appropriate category directory
2. Run `npm run build` to rebuild the bundle (auto-discovers all transformers)
3. Test in the webapp
4. Add a `detector` function if the format has distinctive patterns
5. Optionally add test cases to `test_universal.js`

## Testing Your Transformer

All transformers with a `reverse` function are automatically tested by `test_universal.js`.

### Automatic Testing

Simply add your transformer to the appropriate category directory. The test suite will:
1. Auto-discover it
2. Encode test strings using your `func`
3. Pass encoded output to the universal decoder
4. Verify the decoder identifies your transformer correctly
5. Verify the decoded output matches the original input

### Handling Known Limitations

If your transformer intentionally modifies the input (e.g., lowercases, strips emoji, removes punctuation), add a limitation entry to `test_universal.js`:

```javascript
// In test_universal.js
const limitations = {
    'your_transformer_name': {
        issues: 'Description of what changes',
        normalize: {
            lowercase: true,        // If it lowercases
            uppercase: true,        // If it uppercases
            stripEmoji: true,       // If it removes emoji
            stripPunctuation: true, // If it removes punctuation
            stripSpecialChars: true,// If it removes special chars
            stripWhitespace: true,  // If it removes all whitespace
            stripNonLetters: true,  // If it only keeps A-Z
            collapseWhitespace: true// If it normalizes spacing
        },
        // OR for case-insensitive transformers:
        caseInsensitive: true,
        // OR for partial matches:
        acceptPartial: true
    }
};
```

**Example:**

```javascript
'braille': {
    issues: 'Lowercases, may not encode all special characters',
    normalize: { lowercase: true, stripEmoji: true }
}
```

The test suite will apply these normalizations to both expected and decoded strings before comparison, ensuring tests pass for expected behavior while catching actual bugs.
