// Steganography carriers
// First define encoding function for preview usage
function encodeForPreview(emoji, text) {
    if (!text) return emoji;
    
    // Convert text to binary string
    const binary = Array.from(text)
        .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    
    // Use variation selectors to encode binary
    const vs15 = '\ufe0e';  // text variation selector (0)
    const vs16 = '\ufe0f';  // emoji variation selector (1)
    
    // Start with the emoji character
    // Ensure the emoji has a presentation selector first to standardize it
    let result = emoji + vs16; // Add emoji presentation selector first
    
    // Add variation selectors based on binary representation
    for (const bit of binary) {
        result += bit === '0' ? vs15 : vs16;
    }
    
    // Ensure there's a zero-width space after the encoded content
    result += '\u200B';
    
    return result;
}

const carriers = [
    { 
        emoji: '🐍', 
        name: 'SNAKE', 
        desc: 'Classic Snake', 
        preview: function(text) {
            // Show actual encoded result for preview
            return encodeForPreview(this.emoji, text);
        }
    },
    { 
        emoji: '🐉', 
        name: 'DRAGON', 
        desc: 'Mystical Dragon', 
        preview: function(text) {
            return encodeForPreview(this.emoji, text);
        }
    },
    { 
        emoji: '🦎', 
        name: 'LIZARD', 
        desc: 'Sneaky Lizard', 
        preview: function(text) {
            return encodeForPreview(this.emoji, text);
        }
    },
    { 
        emoji: '🐊', 
        name: 'CROCODILE', 
        desc: 'Dangerous Croc', 
        preview: function(text) {
            return encodeForPreview(this.emoji, text);
        }
    }
];

// Emoji encoding/decoding
function encodeEmoji(emoji, text) {
    if (!text) return emoji;
    
    // Convert text to binary string
    const binary = Array.from(text)
        .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    
    // Use variation selectors to encode binary
    const vs15 = '\ufe0e';  // text variation selector (0)
    const vs16 = '\ufe0f';  // emoji variation selector (1)
    
    // Start with the emoji character
    // Ensure the emoji has a presentation selector first to standardize it
    let result = emoji + vs16; // Add emoji presentation selector first
    
    // Add variation selectors based on binary representation
    for (const bit of binary) {
        result += bit === '0' ? vs15 : vs16;
    }
    
    // Ensure there's a zero-width space after the encoded content
    // This helps with browser rendering
    result += '\u200B';
    
    return result;
}

function decodeEmoji(text) {
    if (!text) return '';
    
    // Find the first emoji character (looking for common emoji Unicode ranges)
    const emojiMatch = text.match(/^([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F1E6}-\u{1F1FF}])/u);
    if (!emojiMatch) return '';
    
    // Extract variation selectors - remove any zero-width spaces first
    text = text.replace(/\u200B/g, '');
    
    // Only extract the emoji and its variation selectors, ignoring other content
    // This prevents random characters from being included in the decoded result
    const emojiChar = emojiMatch[1];
    const pattern = new RegExp(`^${emojiChar}([\ufe0e\ufe0f]+)`, 'u');
    const emojiData = text.match(pattern);
    
    if (!emojiData || !emojiData[1]) return '';
    
    // Get only the variation selectors that follow the emoji directly
    const varSelectors = emojiData[1];
    // Skip the first variation selector as it's used for presentation
    const matches = [...varSelectors.matchAll(/[\ufe0e\ufe0f]/g)];
    if (matches.length <= 1) return ''; // Need at least one bit after the presentation selector
    
    // Convert variation selectors to binary, skipping the first one (presentation selector)
    const binary = matches.slice(1).map(m => m[0] === '\ufe0e' ? '0' : '1').join('');
    
    // Make sure we have complete bytes (multiples of 8 bits)
    const validBinaryLength = Math.floor(binary.length / 8) * 8;
    
    // Convert binary to text
    let decoded = '';
    for (let i = 0; i < validBinaryLength; i += 8) {
        const byte = binary.slice(i, i + 8);
        if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            // Only include printable ASCII characters
            if (charCode >= 32 && charCode <= 126) {
                decoded += String.fromCharCode(charCode);
            }
        }
    }
    
    return decoded;
}

// Invisible text encoding/decoding
function encodeInvisible(text) {
    if (!text) return '';
    
    const bytes = new TextEncoder().encode(text);
    return Array.from(bytes)
        .map(byte => String.fromCodePoint(0xE0000 + byte))
        .join('');
}

function decodeInvisible(text) {
    if (!text) return '';
    
    // Extract valid invisible characters
    const matches = [...text.matchAll(/[\uE0000-\uE007F]/g)];
    if (!matches.length) return '';
    
    // Create byte array from code points
    const bytes = new Uint8Array(matches.length);
    for (let i = 0; i < matches.length; i++) {
        bytes[i] = matches[i][0].codePointAt(0) - 0xE0000;
    }
    
    try {
        // Attempt to properly decode the bytes
        const decoder = new TextDecoder('utf-8', {fatal: false});
        let decoded = decoder.decode(bytes);
        
        // Apply multiple cleaning patterns to eliminate '@' characters
        decoded = decoded.replace(/@+(?=[a-zA-Z0-9])/g, ''); // Remove @ before alphanumeric
        decoded = decoded.replace(/([a-zA-Z0-9])@+/g, '$1');  // Remove @ after alphanumeric
        decoded = decoded.replace(/@+/g, '');                // Remove any remaining @
        
        return decoded;
    } catch (e) {
        console.error('Error decoding invisible text:', e);
        // Fallback approach: character by character reassembly
        let result = '';
        for (let i = 0; i < bytes.length; i++) {
            if (bytes[i] >= 32 && bytes[i] <= 126) { // ASCII printable range
                result += String.fromCharCode(bytes[i]);
            }
        }
        return result;
    }
}

// Export for use in app.js
window.steganography = {
    carriers,
    encodeEmoji,
    decodeEmoji,
    encodeInvisible,
    decodeInvisible
};
