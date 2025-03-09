// Steganography carriers
const carriers = [
    { emoji: '🐍', name: 'SNAKE', desc: 'Classic Snake', preview: text => `🐍${text}` },
    { emoji: '🐉', name: 'DRAGON', desc: 'Mystical Dragon', preview: text => `🐉${text}` },
    { emoji: '🦎', name: 'LIZARD', desc: 'Sneaky Lizard', preview: text => `🦎${text}` },
    { emoji: '🐊', name: 'CROCODILE', desc: 'Dangerous Croc', preview: text => `🐊${text}` }
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
    let result = emoji;
    
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
    const emojiMatch = text.match(/^([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}])/u);
    if (!emojiMatch) return '';
    
    // Extract variation selectors - remove any zero-width spaces first
    text = text.replace(/\u200B/g, '');
    const matches = [...text.matchAll(/[\ufe0e\ufe0f]/g)];
    if (!matches.length) return '';
    
    // Convert variation selectors to binary
    const binary = matches.map(m => m[0] === '\ufe0e' ? '0' : '1').join('');
    
    // Convert binary to text
    let decoded = '';
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.slice(i, i + 8);
        if (byte.length === 8) {
            decoded += String.fromCharCode(parseInt(byte, 2));
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
    
    const matches = [...text.matchAll(/[\uE0000-\uE007F]/g)];
    if (!matches.length) return '';
    
    const bytes = new Uint8Array(
        matches.map(m => m[0].codePointAt(0) - 0xE0000)
    );
    
    return new TextDecoder().decode(bytes);
}

// Export for use in app.js
window.steganography = {
    carriers,
    encodeEmoji,
    decodeEmoji,
    encodeInvisible,
    decodeInvisible
};
