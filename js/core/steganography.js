// Steganography carriers
// Global adjustable options for selectors/zero-width usage
const __STEG_DEFAULTS__ = {
    bitZeroVS: '\ufe0e', // VS15 as 0
    bitOneVS: '\ufe0f',  // VS16 as 1
    initialPresentation: 'emoji', // 'emoji' -> VS16, 'text' -> VS15, 'none'
    trailingZW: '\u200B', // e.g., ZWSP; set to null to disable
    interBitZW: null,      // e.g., '\u200C' ZWNJ, '\u200D' ZWJ; null disables
    interBitEvery: 1,      // insert interBitZW every N bits (1 = after each bit)
    bitOrder: 'msb'        // 'msb' or 'lsb' within each byte
};
let __stegOptions__ = Object.assign({}, __STEG_DEFAULTS__);
function setStegOptions(opts) {
    if (!opts) return;
    __stegOptions__ = Object.assign({}, __stegOptions__, opts);
}
// First define encoding function for preview usage
function encodeForPreview(emoji, text) {
    if (!text) return emoji;
    
    // Convert text to binary string (properly handle UTF-8 including emojis)
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    
    // Convert bytes to binary, respecting bitOrder option
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        let byteBits = bytes[i].toString(2).padStart(8, '0');
        // If LSB first, reverse the bits within each byte
        if (__stegOptions__.bitOrder === 'lsb') {
            byteBits = byteBits.split('').reverse().join('');
        }
        binary += byteBits;
    }
    
    // Use variation selectors to encode binary
    const vs0 = __stegOptions__.bitZeroVS || '\ufe0e';
    const vs1 = __stegOptions__.bitOneVS || '\ufe0f';
    
    // Start with the emoji character
    // Ensure the emoji has a presentation selector first to standardize it
    let result = emoji;
    if (__stegOptions__.initialPresentation === 'emoji') result += '\ufe0f';
    else if (__stegOptions__.initialPresentation === 'text') result += '\ufe0e';
    
    // Add variation selectors based on binary representation
    for (let i=0;i<binary.length;i++) {
        const bit = binary[i];
        result += bit === '0' ? vs0 : vs1;
        if (__stegOptions__.interBitZW && i < binary.length-1 && ((i+1) % Math.max(1, __stegOptions__.interBitEvery)) === 0) {
            result += __stegOptions__.interBitZW;
        }
    }
    
    // Optional trailing zero-width character
    if (__stegOptions__.trailingZW) {
        try { 
            result += window.EscapeParser.parseEscapeSequence(__stegOptions__.trailingZW); 
        } catch (_) { 
            result += '\u200B'; 
        }
    }
    
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
    
    // Convert text to binary string (properly handle UTF-8 including emojis)
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    
    // Convert bytes to binary, respecting bitOrder option
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        let byteBits = bytes[i].toString(2).padStart(8, '0');
        // If LSB first, reverse the bits within each byte
        if (__stegOptions__.bitOrder === 'lsb') {
            byteBits = byteBits.split('').reverse().join('');
        }
        binary += byteBits;
    }
    
    // Use variation selectors to encode binary
    const vs0 = __stegOptions__.bitZeroVS || '\ufe0e';
    const vs1 = __stegOptions__.bitOneVS || '\ufe0f';
    
    // Start with the emoji character
    // Ensure the emoji has a presentation selector first to standardize it
    let result = emoji;
    if (__stegOptions__.initialPresentation === 'emoji') result += '\ufe0f';
    else if (__stegOptions__.initialPresentation === 'text') result += '\ufe0e';
    
    // Add variation selectors based on binary representation
    for (let i=0;i<binary.length;i++) {
        const bit = binary[i];
        result += bit === '0' ? vs0 : vs1;
        if (__stegOptions__.interBitZW && i < binary.length-1 && ((i+1) % Math.max(1, __stegOptions__.interBitEvery)) === 0) {
            result += __stegOptions__.interBitZW;
        }
    }
    
    // Optional trailing zero-width character (helps with rendering in many browsers)
    if (__stegOptions__.trailingZW) {
        try { 
            result += window.EscapeParser.parseEscapeSequence(__stegOptions__.trailingZW); 
        } catch (_) { 
            result += '\u200B'; 
        }
    }
    
    return result;
}

function decodeEmoji(text) {
    if (!text) return '';
    
    // Find the first emoji character (expanded to cover more emoji ranges)
    // Includes: emoticons, symbols, pictographs, transport, flags, etc.
    // Flag emojis are TWO regional indicators, so match them specially
    let emojiMatch = text.match(/^([\u{1F1E6}-\u{1F1FF}]{2})/u); // Flag emoji (2 regional indicators)
    if (!emojiMatch) {
        emojiMatch = text.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}])/u); // Other emojis
    }
    if (!emojiMatch) return '';
    
    // Extract variation selectors - remove all zero-width characters first
    // This includes ZWSP (\u200B), ZWNJ (\u200C), ZWJ (\u200D), and BOM (\ufeff)
    // These are used as interBitZW and trailingZW but don't contain data
    text = text.replace(/[\u200B\u200C\u200D\ufeff]/g, '');
    
    // Only extract the emoji and its variation selectors, ignoring other content
    // This prevents random characters from being included in the decoded result
    const emojiChar = emojiMatch[1];
    // Now we only need to match variation selectors (VS15/VS16)
    const pattern = new RegExp(`^${emojiChar}([\ufe0e\ufe0f]+)`, 'u');
    const emojiData = text.match(pattern);
    
    if (!emojiData || !emojiData[1]) return '';
    
    // Extract variation selectors only (all zero-width chars already removed)
    const rawSeq = emojiData[1];
    const matches = [...rawSeq.matchAll(/[\ufe0e\ufe0f]/g)];
    if (matches.length === 0) return '';
    // Decide if the first selector is presentation
    const skip = (__stegOptions__.initialPresentation === 'none') ? 0 : 1;
    if (matches.length <= skip) return '';
    const zeroSel = __stegOptions__.bitZeroVS || '\ufe0e';
    const oneSel  = __stegOptions__.bitOneVS || '\ufe0f';
    let binary = matches.slice(skip).map(m => m[0] === zeroSel ? '0' : (m[0] === oneSel ? '1' : '')).join('');
    
    // Make sure we have complete bytes (multiples of 8 bits)
    const validBinaryLength = Math.floor(binary.length / 8) * 8;
    
    // Convert binary to bytes (respect bitOrder)
    const bytes = [];
    for (let i = 0; i < validBinaryLength; i += 8) {
        let byte = binary.slice(i, i + 8);
        if (__stegOptions__.bitOrder === 'lsb') {
            byte = byte.split('').reverse().join('');
        }
        if (byte.length === 8) {
            const byteValue = parseInt(byte, 2);
            bytes.push(byteValue);
        }
    }
    
    // Convert bytes to UTF-8 text (properly handle emojis and multi-byte characters)
    try {
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const decoded = decoder.decode(new Uint8Array(bytes));
        return decoded;
    } catch (e) {
        console.error('Error decoding emoji steganography:', e);
        console.error('Bytes were:', bytes);
        // Fallback to ASCII-only decoding
        return bytes
            .filter(b => b >= 32 && b <= 126)
            .map(b => String.fromCharCode(b))
            .join('');
    }
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
    decodeInvisible,
    setStegOptions
};
