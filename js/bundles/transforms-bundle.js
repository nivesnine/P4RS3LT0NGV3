/**
 * P4RS3LT0NGV3 Transforms - Bundled for Browser
 * Auto-generated from modular source files
 * Build date: 2025-11-19T10:37:48.253Z
 */

(function() {
'use strict';

// BaseTransformer class
/**
 * Base Transformer Class
 * 
 * Provides default implementations and structure for all text transformers.
 * 
 * USAGE:
 * 
 * 1. Simple character map transformer (auto-generates reverse):
 * 
 *    new BaseTransformer({
 *        name: 'My Transform',
 *        priority: 85,
 *        map: { 'a': 'α', 'b': 'β', ... },
 *        func: function(text) {
 *            return [...text].map(c => this.map[c] || c).join('');
 *        }
 *    });
 * 
 * 2. Custom transformer with manual reverse:
 * 
 *    new BaseTransformer({
 *        name: 'ROT13',
 *        priority: 60,
 *        func: function(text) { ... },
 *        reverse: function(text) { ... }
 *    });
 * 
 * 3. Encoding-only transformer (no reverse):
 * 
 *    new BaseTransformer({
 *        name: 'Random Mix',
 *        priority: 0,
 *        canDecode: false,
 *        func: function(text) { ... }
 *    });
 */

class BaseTransformer {
    /**
     * Create a new transformer
     * @param {Object} config - Transformer configuration
     * @param {string} config.name - Display name (required)
     * @param {Function} config.func - Encoding function (required)
     * @param {number} [config.priority=85] - Decoder priority (1-310)
     * @param {Object} [config.map] - Character mapping (if provided, auto-generates reverse)
     * @param {Function} [config.reverse] - Custom decoder function
     * @param {Function} [config.preview] - Preview function (defaults to func)
     * @param {Function} [config.detector] - Custom detection function (text) => boolean
     * @param {boolean} [config.canDecode=true] - Whether this transformer can decode
     * @param {string} [config.category] - Category for organization
     * @param {string} [config.description] - Help text
     */
    constructor(config) {
        if (!config.name || !config.func) {
            throw new Error('Transformer requires at least "name" and "func"');
        }

        // Copy ALL config properties to instance first (for custom properties like alphabet, etc.)
        Object.assign(this, config);
        
        // Override with properly bound functions
        this.func = config.func.bind(this);
        this.priority = config.priority ?? 85; // Default: Unicode transformations
        this.canDecode = config.canDecode ?? true;
        
        // Preview function (defaults to func)
        if (config.preview) {
            this.preview = config.preview.bind(this);
        } else {
            this.preview = this.func;
        }
        
        // Detector function (for universal decoder)
        if (config.detector) {
            this.detector = config.detector.bind(this);
        } else {
            this.detector = null;
        }
        
        // Reverse/decode function
        if (!this.canDecode) {
            // Explicitly cannot decode
            this.reverse = null;
        } else if (config.reverse) {
            // Custom reverse function provided
            this.reverse = config.reverse.bind(this);
        } else if (config.map) {
            // Auto-generate reverse from character map
            this.reverse = this._autoReverse.bind(this);
        } else {
            // No reverse available (but might be added later)
            this.reverse = null;
        }
    }

    /**
     * Auto-generated reverse function for character map transformers
     * Builds a reverse map and decodes character-by-character
     * @private
     */
    _autoReverse(text) {
        if (!this.map) return text;
        
        // Build reverse map (cached for performance)
        if (!this._reverseMap) {
            this._reverseMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                this._reverseMap[value] = key;
            }
        }
        
        return [...text].map(c => this._reverseMap[c] || c).join('');
    }

    /**
     * Get transformer info as JSON
     */
    toJSON() {
        return {
            name: this.name,
            priority: this.priority,
            canDecode: this.canDecode,
            category: this.category,
            description: this.description,
            hasMap: !!this.map,
            hasReverse: !!this.reverse
        };
    }
}

/**
 * PRIORITY GUIDE:
 * 
 * 310 = Semaphore Flags (only 8 specific arrow emojis)
 * 300 = Exclusive character sets (Binary, Morse, Braille, Brainfuck, Tap Code)
 * 290 = Hexadecimal
 * 285 = Pattern-based (Pig Latin, Dovahzul)
 * 280 = Base32
 * 270-275 = Base64/Base58 family
 * 260 = A1Z26
 * 150 = Active transform (user context)
 * 100 = High confidence (Emoji Steganography, unique Unicode ranges)
 * 85 = Unicode transformations (default for fancy text)
 * 70 = Common encodings (URL, HTML, ASCII85)
 * 60 = Ciphers (ROT13, Caesar)
 * 50 = Generic text transforms
 * 20 = Low confidence generic
 * 1 = Invisible text (last resort)
 * 0 = Cannot decode / encode-only
 */

BaseTransformer;



const transforms = {};

// base64 (from base-encodings/base64.js)
transforms['base64'] = new BaseTransformer({
    name: 'Base64',
    priority: 270,
    category: 'base-encodings',
    
    // Detector: Only Base64 characters (A-Z, a-z, 0-9, +, /, =)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[A-Za-z0-9+\/=]+$/.test(cleaned);
    },
    
    func: function(text) {
            try {
                // Properly encode UTF-8 text (including emojis) to Base64
                const encoder = new TextEncoder();
                const bytes = encoder.encode(text);
                let binaryString = '';
                for (let i = 0; i < bytes.length; i++) {
                    binaryString += String.fromCharCode(bytes[i]);
                }
                return btoa(binaryString);
            } catch (e) {
                return '[Invalid input]';
            }
        },
        preview: function(text) {
            if (!text) return '[base64]';
            try {
                const full = this.func(text);
                return full.substring(0, 12) + (full.length > 12 ? '...' : '');
            } catch (e) {
                return '[Invalid input]';
            }
        },
        reverse: function(text) {
            try {
                // Properly decode Base64 to UTF-8 text (including emojis)
                const binaryString = atob(text);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(bytes);
            } catch (e) {
                return text;
            }
        }

});

// base64url (from base-encodings/base64url.js)
transforms['base64url'] = new BaseTransformer({
    name: 'Base64 URL',
    priority: 270,
    category: 'base-encodings',
    
    // Detector: Only Base64 URL characters (A-Z, a-z, 0-9, -, _, =)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[A-Za-z0-9\-_=]+$/.test(cleaned);
    },
    
    func: function(text) {
            if (!text) return '';
            try {
                // Properly encode UTF-8 text (including emojis) to Base64 URL
                const encoder = new TextEncoder();
                const bytes = encoder.encode(text);
                let binaryString = '';
                for (let i = 0; i < bytes.length; i++) {
                    binaryString += String.fromCharCode(bytes[i]);
                }
                const std = btoa(binaryString);
                return std.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
            } catch (e) {
                return '[Invalid input]';
            }
        },
        preview: function(text) {
            if (!text) return '[b64url]';
            const full = this.func(text);
            return full.substring(0, 12) + (full.length > 12 ? '...' : '');
        },
        reverse: function(text) {
            if (!text) return '';
            let std = text.replace(/-/g, '+').replace(/_/g, '/');
            // pad
            while (std.length % 4 !== 0) std += '=';
            try {
                // Properly decode Base64 URL to UTF-8 text (including emojis)
                const binaryString = atob(std);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(bytes);
            } catch (e) {
                return text;
            }
        }

});

// base32 (from base-encodings/base32.js)
transforms['base32'] = new BaseTransformer({
    name: 'Base32',
    priority: 280,
    category: 'base-encodings',
    
    // Detector: Only Base32 characters (A-Z, 2-7, =)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 8 && /^[A-Z2-7=]+$/.test(cleaned);
    },
    
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
        func: function(text) {
            if (!text) return '';
            
            // Convert text to bytes
            const bytes = new TextEncoder().encode(text);
            let result = '';
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < bytes.length; i++) {
                value = (value << 8) | bytes[i];
                bits += 8;
                
                while (bits >= 5) {
                    bits -= 5;
                    result += this.alphabet[(value >> bits) & 0x1F];
                }
            }
            
            // Handle remaining bits
            if (bits > 0) {
                result += this.alphabet[(value << (5 - bits)) & 0x1F];
            }
            
            // Add padding
            while (result.length % 8 !== 0) {
                result += '=';
            }
            
            return result;
        },
        preview: function(text) {
            if (!text) return '[base32]';
            const full = this.func(text);
            return full.substring(0, 16) + (full.length > 16 ? '...' : '');
        },
        reverse: function(text) {
            if (!text) return '';
            
            // Remove padding and whitespace
            text = text.replace(/\s+/g, '').replace(/=+$/, '');
            
            if (text.length === 0) return '';
            
            // Create reverse map
            const revMap = {};
            for (let i = 0; i < this.alphabet.length; i++) {
                revMap[this.alphabet[i]] = i;
            }
            
            const bytes = [];
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i].toUpperCase();
                if (revMap[char] === undefined) continue; // Skip invalid characters
                
                value = (value << 5) | revMap[char];
                bits += 5;
                
                while (bits >= 8) {
                    bits -= 8;
                    bytes.push((value >> bits) & 0xFF);
                }
            }
            
            // Use TextDecoder to properly handle UTF-8 multi-byte characters
            return new TextDecoder().decode(new Uint8Array(bytes));
        }

});

// base58 (from base-encodings/base58.js)
transforms['base58'] = new BaseTransformer({
    name: 'Base58',
    priority: 275,
    category: 'base-encodings',
    
    // Detector: Only Base58 characters (excludes 0, O, I, l)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(cleaned);
    },
    
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            // Count leading zeros
            let zeros = 0;
            for (let b of bytes) { if (b === 0) zeros++; else break; }
            // Convert to BigInt
            let n = 0n;
            for (let b of bytes) { n = (n << 8n) + BigInt(b); }
            // Encode
            let out = '';
            while (n > 0n) {
                const rem = n % 58n;
                n = n / 58n;
                out = this.alphabet[Number(rem)] + out;
            }
            // Add leading zeros as '1'
            for (let i = 0; i < zeros; i++) out = '1' + out;
            return out || '1';
        },
        preview: function(text) {
            if (!text) return '[base58]';
            const full = this.func(text);
            return full.substring(0, 12) + (full.length > 12 ? '...' : '');
        },
        reverse: function(text) {
            if (!text) return '';
            // Count leading '1's
            let zeros = 0;
            for (let c of text) { if (c === '1') zeros++; else break; }
            // Convert to BigInt
            let n = 0n;
            for (let c of text) {
                const i = this.alphabet.indexOf(c);
                if (i < 0) continue;
                n = n * 58n + BigInt(i);
            }
            // Convert BigInt to bytes
            const bytes = [];
            while (n > 0n) {
                bytes.unshift(Number(n % 256n));
                n = n / 256n;
            }
            for (let i = 0; i < zeros; i++) bytes.unshift(0);
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }

});

// base62 (from base-encodings/base62.js)
transforms['base62'] = new BaseTransformer({

        name: 'Base62',
    priority: 290,
    category: 'base-encodings',
        alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let n = 0n;
            for (let b of bytes) { n = (n << 8n) + BigInt(b); }
            if (n === 0n) return '0';
            let out = '';
            while (n > 0n) {
                const rem = n % 62n;
                n = n / 62n;
                out = this.alphabet[Number(rem)] + out;
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '[base62]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            if (!text) return '';
            let n = 0n;
            for (let c of text) {
                const i = this.alphabet.indexOf(c);
                if (i < 0) continue;
                n = n * 62n + BigInt(i);
            }
            const bytes = [];
            while (n > 0n) {
                bytes.unshift(Number(n % 256n));
                n = n / 256n;
            }
            if (bytes.length === 0) bytes.push(0);
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }

});

// base45 (from base-encodings/base45.js)
transforms['base45'] = new BaseTransformer({

        name: 'Base45',
    priority: 290,
    category: 'base-encodings',
        alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
        func: function(text) {
            const bytes = new TextEncoder().encode(text);
            const chars = [];
            for (let i=0;i<bytes.length;i+=2) {
                if (i+1 < bytes.length) {
                    const x = 256*bytes[i] + bytes[i+1];
                    const e = x % 45; const d = Math.floor(x/45) % 45; const c = Math.floor(x/45/45);
                    chars.push(this.alphabet[e], this.alphabet[d], this.alphabet[c]);
                } else {
                    const x = bytes[i];
                    const e = x % 45; const d = Math.floor(x/45);
                    chars.push(this.alphabet[e], this.alphabet[d]);
                }
            }
            return chars.join('');
        },
        preview: function(text) {
            if (!text) return 'QED8W';
            return this.func(text.slice(0,3));
        },
        reverse: function(text) {
            const index = {}; for (let i=0;i<this.alphabet.length;i++) index[this.alphabet[i]] = i;
            const codes = [...text].map(c => index[c]).filter(v => v !== undefined);
            const out = [];
            for (let i=0;i<codes.length;i+=3) {
                if (i+2 < codes.length) {
                    const x = codes[i] + codes[i+1]*45 + codes[i+2]*45*45;
                    out.push(x >> 8, x & 0xFF);
                } else if (i+1 < codes.length) {
                    const x = codes[i] + codes[i+1]*45;
                    out.push(x & 0xFF);
                }
            }
            return new TextDecoder().decode(Uint8Array.from(out));
        }

});

// hex (from base-encodings/hex.js)
transforms['hex'] = new BaseTransformer({
    name: 'Hexadecimal',
    priority: 290,
    category: 'base-encodings',
    
    // Detector: Only hex characters (0-9, A-F)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[0-9A-Fa-f]+$/.test(cleaned);
    },
    
    func: function(text) {
            // Use TextEncoder to properly handle UTF-8 (including emoji)
            const encoder = new TextEncoder();
            const bytes = encoder.encode(text);
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        },
        preview: function(text) {
            if (!text) return '[hex]';
            const full = this.func(text);
            return full.substring(0, 20) + (full.length > 20 ? '...' : '');
        },
        reverse: function(text) {
            const hexText = text.replace(/\s+/g, '');
            const bytes = [];
            
            for (let i = 0; i < hexText.length; i += 2) {
                const byte = hexText.substr(i, 2);
                if (byte.length === 2) {
                    bytes.push(parseInt(byte, 16));
                }
            }
            
            // Use TextDecoder to properly decode UTF-8
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(bytes));
        }

});

// binary (from base-encodings/binary.js)
transforms['binary'] = new BaseTransformer({
    name: 'Binary',
    priority: 300,
    category: 'base-encodings',
    
    // Detector: Only 0s, 1s, and spaces
    detector: function(text) {
        const cleaned = text.trim();
        const noSpaces = cleaned.replace(/\s/g, '');
        return noSpaces.length >= 8 && /^[01\s]+$/.test(cleaned);
    },
    
    func: function(text) {
            // Use TextEncoder to properly handle UTF-8 (including emoji)
            const encoder = new TextEncoder();
            const bytes = encoder.encode(text);
            return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
        },
        preview: function(text) {
            if (!text) return '[binary]';
            const full = this.func(text);
            return full.substring(0, 24) + (full.length > 24 ? '...' : '');
        },
        reverse: function(text) {
            // Remove spaces and ensure we have valid binary
            const binText = text.replace(/\s+/g, '');
            const bytes = [];
            
            // Process 8 bits at a time
            for (let i = 0; i < binText.length; i += 8) {
                const byte = binText.substr(i, 8);
                if (byte.length === 8) {
                    bytes.push(parseInt(byte, 2));
                }
            }
            
            // Use TextDecoder to properly decode UTF-8
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(bytes));
        }

});

// ascii85 (from base-encodings/ascii85.js)
transforms['ascii85'] = new BaseTransformer({
    name: 'ASCII85',
    priority: 290,
    category: 'base-encodings',
    
    // Detector: ASCII85 has distinctive <~ ~> wrapper
    detector: function(text) {
        return text.startsWith('<~') && text.endsWith('~>');
    },
    
    func: function(text) {
            // Simple ASCII85 encoding implementation
            // Use TextEncoder to properly handle multi-byte UTF-8 characters
            const bytes = new TextEncoder().encode(text);
            let result = '<~';
            let buffer = 0;
            let bufferLength = 0;
            
            for (let i = 0; i < bytes.length; i++) {
                buffer = (buffer << 8) | bytes[i];
                bufferLength += 8;
                
                if (bufferLength >= 32) {
                    let value = buffer >>> (bufferLength - 32);
                    buffer &= (1 << (bufferLength - 32)) - 1;
                    bufferLength -= 32;
                    
                    if (value === 0) {
                        result += 'z';
                    } else {
                        for (let j = 4; j >= 0; j--) {
                            const digit = (value / Math.pow(85, j)) % 85;
                            result += String.fromCharCode(digit + 33);
                        }
                    }
                }
            }
            
            // Handle remaining bits
            if (bufferLength > 0) {
                buffer <<= (32 - bufferLength);
                let value = buffer;
                const bytes = Math.ceil(bufferLength / 8);
                
                for (let j = 4; j >= (4 - bytes); j--) {
                    const digit = (value / Math.pow(85, j)) % 85;
                    result += String.fromCharCode(digit + 33);
                }
            }
            
            return result + '~>';
        },
        preview: function(text) {
            if (!text) return '[ascii85]';
            const full = this.func(text);
            return full.substring(0, 16) + (full.length > 16 ? '...' : '');
        },
        reverse: function(text) {
            // Check if it's a valid ASCII85 string
            if (!text.startsWith('<~') || !text.endsWith('~>')) {
                return text;
            }
            
            // Remove delimiters and whitespace
            text = text.substring(2, text.length - 2).replace(/\s+/g, '');
            
            const bytes = [];
            let i = 0;
            
            while (i < text.length) {
                // Handle 'z' special case (represents 4 zero bytes)
                if (text[i] === 'z') {
                    bytes.push(0, 0, 0, 0);
                    i++;
                    continue;
                }
                
                // Process a group of 5 characters
                if (i < text.length) {
                    let value = 0;
                    const groupSize = Math.min(5, text.length - i);
                    
                    // Convert the group to a 32-bit value
                    for (let j = 0; j < groupSize; j++) {
                        value = value * 85 + (text.charCodeAt(i + j) - 33);
                    }
                    
                    // Pad with 'u' (84) if needed for partial groups
                    for (let j = groupSize; j < 5; j++) {
                        value = value * 85 + 84;
                    }
                    
                    // Extract bytes from the value
                    // groupSize chars encodes (groupSize - 1) bytes
                    const bytesToWrite = groupSize - 1;
                    for (let j = 0; j < bytesToWrite; j++) {
                        bytes.push((value >>> ((3 - j) * 8)) & 0xFF);
                    }
                    
                    i += groupSize;
                } else {
                    break;
                }
            }
            
            // Use TextDecoder to properly handle UTF-8 multi-byte characters
            return new TextDecoder().decode(new Uint8Array(bytes));
        }

});

// rot13 (from ciphers/rot13.js)
transforms['rot13'] = new BaseTransformer({
    name: 'ROT13',
    priority: 60,
    category: 'ciphers',
    func: function(text) {
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) { // Uppercase letters
                return String.fromCharCode(((code - 65 + 13) % 26) + 65);
            } else if (code >= 97 && code <= 122) { // Lowercase letters
                return String.fromCharCode(((code - 97 + 13) % 26) + 97);
            } else {
                return c;
            }
        }).join('');
    },
    preview: function(text) {
        if (!text) return '[rot13]';
        return this.func(text.slice(0, 3)) + '...';
    },
    reverse: function(text) {
        // ROT13 is its own inverse
        return this.func(text);
    },
    // Detector: Check if text is letters-only (potential ROT13)
    detector: function(text) {
        // ROT13 only affects letters, so check if text contains mostly letters
        // Remove punctuation, numbers, and common symbols for the ratio check
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        // Must be mostly letters (at least 70%) and have some length
        if (cleaned.length < 5) return false;
        const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
        return letterCount / cleaned.length > 0.7;
    }
});

// rot47 (from ciphers/rot47.js)
transforms['rot47'] = new BaseTransformer({

        name: 'ROT47',
    priority: 60,
    category: 'ciphers',
        func: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                // ROT47 operates on ASCII 33-126 (94 chars), rotating by 47 (half of 94)
                // This makes ROT47 self-inverse (encoding = decoding)
                if (code >= 33 && code <= 126) {
                    return String.fromCharCode(33 + ((code - 33 + 47) % 94));
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            // ROT47 is self-inverse, so reverse is the same as forward
            return this.func(text);
        }

});

// rot18 (from ciphers/rot18.js)
transforms['rot18'] = new BaseTransformer({

        name: 'ROT18',
    priority: 60,
    category: 'ciphers',
        func: function(text) {
            const rot13 = c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCharCode(65 + ((code-65 + 13)%26));
                if (code >= 97 && code <= 122) return String.fromCharCode(97 + ((code-97 + 13)%26));
                return c;
            };
            const rot5 = c => {
                if (c >= '0' && c <= '9') return String.fromCharCode(48 + (((c.charCodeAt(0)-48)+5)%10));
                return c;
            };
            return [...text].map(c => rot5(rot13(c))).join('');
        },
        preview: function(text) {
            if (!text) return '[rot18]';
            return this.func(text.slice(0, 8)) + (text.length>8?'...':'');
        },
        reverse: function(text) { return this.func(text); }

});

// rot5 (from ciphers/rot5.js)
transforms['rot5'] = new BaseTransformer({

        name: 'ROT5',
    priority: 60,
    category: 'ciphers',
        func: function(text) {
            return [...text].map(c => {
                if (c >= '0' && c <= '9') {
                    const n = c.charCodeAt(0) - 48;
                    return String.fromCharCode(48 + ((n + 5) % 10));
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[rot5]';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            // ROT5 is its own inverse
            return this.func(text);
        }

});

// caesar (from ciphers/caesar.js)
transforms['caesar'] = new BaseTransformer({

        name: 'Caesar Cipher',
    priority: 60,
    category: 'ciphers',
        shift: 3, // Traditional Caesar shift is 3
        func: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                // Only shift letters, leave other characters unchanged
                if (code >= 65 && code <= 90) { // Uppercase letters
                    return String.fromCharCode(((code - 65 + this.shift) % 26) + 65);
                } else if (code >= 97 && code <= 122) { // Lowercase letters
                    return String.fromCharCode(((code - 97 + this.shift) % 26) + 97);
                } else {
                    return c;
                }
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[cursive]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // For decoding, shift in the opposite direction
            const originalShift = this.shift;
            this.shift = 26 - (this.shift % 26); // Reverse the shift
            const result = this.func(text);
            this.shift = originalShift; // Restore original shift
            return result;
        },
        // Detector: Check if text is letters-only (potential Caesar cipher)
        detector: function(text) {
            // Caesar cipher only affects letters, so check if text contains mostly letters
            // Remove punctuation, numbers, and common symbols for the ratio check
            const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
            // Must be mostly letters (at least 70%) and have some length
            if (cleaned.length < 5) return false;
            const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
            return letterCount / cleaned.length > 0.7;
        }

});

// atbash (from ciphers/atbash.js)
transforms['atbash'] = new BaseTransformer({
    name: 'Atbash Cipher',
    priority: 60,
    category: 'ciphers',
    // Detector: Check if text is mostly letters (atbash is hard to detect specifically)
    detector: function(text) {
        // Remove punctuation, numbers, and common symbols for the ratio check
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        if (cleaned.length < 5) return false;
        const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
        // Must be mostly letters (at least 70%)
        return letterCount / cleaned.length > 0.7;
    },
    func: function(text) {
        const a = 'a'.charCodeAt(0), z = 'z'.charCodeAt(0);
        const A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= A && code <= Z) return String.fromCharCode(Z - (code - A));
            if (code >= a && code <= z) return String.fromCharCode(z - (code - a));
            return c;
        }).join('');
    },
    preview: function(text) {
        if (!text) return '[atbash]';
        return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
    },
    reverse: function(text) {
        // Atbash is its own inverse
        return this.func(text);
    }
});

// vigenere (from ciphers/vigenere.js)
transforms['vigenere'] = new BaseTransformer({

        name: 'Vigenère Cipher',
    priority: 60,
    category: 'ciphers',
        key: 'KEY',
        func: function(text) {
            const key = this.key;
            let out = '';
            let j = 0;
            for (let i=0;i<text.length;i++) {
                const c = text[i];
                const code = c.charCodeAt(0);
                const k = key[j % key.length].toUpperCase().charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) { out += String.fromCharCode(65 + ((code-65 + k)%26)); j++; }
                else if (code >= 97 && code <= 122) { out += String.fromCharCode(97 + ((code-97 + k)%26)); j++; }
                else out += c;
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '[Vigenère]';
            return this.func(text.slice(0,8)) + (text.length>8?'...':'');
        },
        reverse: function(text) {
            const key = this.key;
            let out = '';
            let j = 0;
            for (let i=0;i<text.length;i++) {
                const c = text[i];
                const code = c.charCodeAt(0);
                const k = key[j % key.length].toUpperCase().charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) { out += String.fromCharCode(65 + ((code-65 + 26 - (k%26))%26)); j++; }
                else if (code >= 97 && code <= 122) { out += String.fromCharCode(97 + ((code-97 + 26 - (k%26))%26)); j++; }
                else out += c;
            }
            return out;
        }

});

// rail_fence (from ciphers/rail-fence.js)
transforms['rail_fence'] = new BaseTransformer({

        name: 'Rail Fence (3 Rails)',
    priority: 60,
    category: 'ciphers',
        rails: 3,
        func: function(text) {
            const rails = Array.from({length: this.rails}, () => []);
            let rail = 0, dir = 1;
            for (const ch of text) {
                rails[rail].push(ch);
                rail += dir;
                if (rail === 0 || rail === this.rails-1) dir *= -1;
            }
            return rails.flat().join('');
        },
        preview: function(text) {
            if (!text) return '[rail]';
            return this.func(text.slice(0,12)) + (text.length>12?'...':'');
        },
        reverse: function(text) {
            // Use Array.from to properly handle multi-byte UTF-8 characters
            const chars = Array.from(text);
            const len = chars.length;
            const pattern = [];
            let rail = 0, dir = 1;
            for (let i=0;i<len;i++) {
                pattern.push(rail);
                rail += dir;
                if (rail === 0 || rail === this.rails-1) dir *= -1;
            }
            const counts = Array(this.rails).fill(0);
            for (const r of pattern) counts[r]++;
            const railsArr = [];
            let idx = 0;
            for (let r=0;r<this.rails;r++) {
                railsArr[r] = chars.slice(idx, idx+counts[r]);
                idx += counts[r];
            }
            const positions = Array(this.rails).fill(0);
            let out = '';
            for (const r of pattern) {
                out += railsArr[r][positions[r]++];
            }
            return out;
        }

});

// affine (from ciphers/affine.js)
transforms['affine'] = new BaseTransformer({

        name: 'Affine Cipher (a=5,b=8)',
    priority: 60,
    category: 'ciphers',
        a: 5, b: 8, m: 26, invA: 21, // 5*21 ≡ 1 (mod 26)
        func: function(text) {
            const {a,b,m} = this;
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                if (code>=65 && code<=90) return String.fromCharCode(65 + ((a*(code-65)+b)%m));
                if (code>=97 && code<=122) return String.fromCharCode(97 + ((a*(code-97)+b)%m));
                return c;
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[affine]';
            return this.func(text.slice(0,8)) + (text.length>8?'...':'');
        },
        reverse: function(text) {
            const {invA,b,m} = this;
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                if (code>=65 && code<=90) return String.fromCharCode(65 + ((invA*((code-65 - b + m)%m))%m));
                if (code>=97 && code<=122) return String.fromCharCode(97 + ((invA*((code-97 - b + m)%m))%m));
                return c;
            }).join('');
        }

});

// baconian (from ciphers/baconian.js)
transforms['baconian'] = new BaseTransformer({

        name: 'Baconian Cipher',
    priority: 60,
    category: 'ciphers',
        table: (function(){
            const map = {};
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i=0;i<26;i++) {
                const code = i.toString(2).padStart(5,'0').replace(/0/g,'A').replace(/1/g,'B');
                map[alphabet[i]] = code;
            }
            return map;
        })(),
        func: function(text) {
            return [...text.toUpperCase()].map(ch => {
                if (this.table[ch]) return this.table[ch];
                if (/[\s]/.test(ch)) return '/';
                return ch;
            }).join(' ');
        },
        preview: function(text) {
            if (!text) return 'AAAAA AABBA ...';
            return this.func((text || 'AB').slice(0,2));
        },
        reverse: function(text) {
            const rev = {};
            Object.keys(this.table).forEach(k => rev[this.table[k]] = k);
            const tokens = text.trim().split(/\s+/);
            return tokens.map(tok => {
                if (tok === '/') return ' ';
                const clean = tok.replace(/[^AB]/g,'');
                if (clean.length === 5 && rev[clean]) return rev[clean];
                return tok;
            }).join('');
        }

});

// upside_down (from unicode-styles/upside-down.js)
transforms['upside_down'] = new BaseTransformer({

        name: 'Upside Down',
    priority: 85,
    category: 'unicode-styles',
        map: {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ',
            'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
            's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
            'A': '∀', 'B': 'B', 'C': 'Ɔ', 'D': 'D', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I',
            'J': 'ſ', 'K': 'K', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'R',
            'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
            '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
            '8': '8', '9': '6', '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': ',,', "'": ',',
            '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
            '&': '⅋', '_': '‾'
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return revMap;
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).reverse().join('');
        },
        preview: function(text) {
            if (!text) return '[upside down]';
            return this.func(text.slice(0, 8));
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return [...text].map(c => revMap[c] || c).reverse().join('');
        }

});

// bubble (from unicode-styles/bubble.js)
transforms['bubble'] = new BaseTransformer({

        name: 'Bubble',
    priority: 85,
    category: 'unicode-styles',
        map: {
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ',
            'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ',
            's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ',
            'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ',
            'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        // Detector: Check for bubble (enclosed alphanumerics) characters
        detector: function(text) {
            // Enclosed alphanumerics (U+24B6-U+24EA for circled letters)
            return /[ⓐ-ⓩⒶ-Ⓩ]/.test(text);
        }

});

// cursive (from unicode-styles/cursive.js)
transforms['cursive'] = new BaseTransformer({
    name: 'Cursive',
    priority: 85,
    category: 'unicode',
    map: {
        'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
        'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
        's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
        'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
        'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
        'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    },
    // Detector: Check for cursive/bold cursive Unicode characters
    detector: function(text) {
        // Bold cursive mathematical characters (check for presence)
        return /[𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩]/u.test(text);
    }
});

// zalgo (from unicode-styles/zalgo.js)
transforms['zalgo'] = new BaseTransformer({

        name: 'Zalgo',
    priority: 85,
    category: 'unicode-styles',
        marks: [
            '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308',
            '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311',
            '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u031B', '\u033D', '\u033E', '\u033F'
        ],
        func: function(text) {
            return [...text].map(c => {
                let result = c;
                for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
                    result += this.marks[Math.floor(Math.random() * this.marks.length)];
                }
                return result;
            }).join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            // Remove all combining diacritical marks (Unicode range 0300-036F)
            // This includes the marks used by Zalgo and many others
            return text.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
        },
        // Detector: Check for Zalgo text (excessive combining marks)
        detector: function(text) {
            // Zalgo text has many combining diacritical marks
            const combiningMarksRegex = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g;
            const matches = text.match(combiningMarksRegex) || [];
            // Threshold: at least 4 combining marks to distinguish from normal accented text
            return matches.length > 3;
        }

});

// vaporwave (from unicode-styles/vaporwave.js)
transforms['vaporwave'] = new BaseTransformer({

        name: 'Vaporwave',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            return [...text].join(' ');
        },
        preview: function(text) {
            if (!text) return '[vaporwave]';
            return [...text.slice(0, 3)].join(' ') + '...';
        },
        reverse: function(text) {
            // Remove single spaces between characters, but preserve word boundaries (double+ spaces)
            // Replace double spaces with a marker, remove single spaces, restore markers
            return text.replace(/  +/g, '\x00').replace(/ /g, '').replace(/\x00/g, ' ');
        }

});

// small_caps (from unicode-styles/small-caps.js)
transforms['small_caps'] = new BaseTransformer({

        name: 'Small Caps',
    priority: 85,
    category: 'unicode-styles',
        map: {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
            'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
            's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        // Detector: Check for small caps Unicode characters
        detector: function(text) {
            // Small caps use various Unicode ranges (U+1D00-U+1D7F phonetic extensions, U+A730-U+A7FF Latin Extended-D)
            return /[ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀᴛᴜᴠᴡʏᴢ]/.test(text);
        }

});

// fullwidth (from unicode-styles/fullwidth.js)
transforms['fullwidth'] = new BaseTransformer({

        name: 'Full Width',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                // Convert ASCII to full-width equivalents
                if (code >= 33 && code <= 126) {
                    return String.fromCharCode(code + 0xFEE0);
                } else if (code === 32) { // Space
                    return '　'; // Full-width space
                } else {
                    return c;
                }
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[tengwar]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                // Convert full-width back to ASCII
                if (code >= 0xFF01 && code <= 0xFF5E) {
                    return String.fromCharCode(code - 0xFEE0);
                } else if (code === 0x3000) { // Full-width space
                    return ' '; // ASCII space
                } else {
                    return c;
                }
            }).join('');
        }

});

// strikethrough (from unicode-styles/strikethrough.js)
transforms['strikethrough'] = new BaseTransformer({

        name: 'Strikethrough',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            // Use proper Unicode combining characters for strikethrough
            const segments = window.emojiLibrary.splitEmojis(text);
            return segments.map(c => c + '\u0336').join('');
        },
        preview: function(text) {
            if (!text) return '[hieroglyphics]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // Remove combining strikethrough characters
            return text.replace(/\u0336/g, '');
        }

});

// underline (from unicode-styles/underline.js)
transforms['underline'] = new BaseTransformer({

        name: 'Underline',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            // Use proper Unicode combining characters for underline
            const segments = window.emojiLibrary.splitEmojis(text);
            return segments.map(c => c + '\u0332').join('');
        },
        preview: function(text) {
            if (!text) return '[ogham]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // Remove combining underline characters
            return text.replace(/\u0332/g, '');
        }

});

// medieval (from unicode-styles/medieval.js)
transforms['medieval'] = new BaseTransformer({
    name: 'Medieval',
    priority: 85,
    category: 'unicode',
    map: {
        'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎',
        'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗',
        's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟',
        'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴',
        'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽',
        'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    },
    // Detector: Check for medieval Unicode characters
    detector: function(text) {
        // Medieval characters (Fraktur bold)
        return /[𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅]/.test(text);
    }
});

// monospace (from unicode-styles/monospace.js)
transforms['monospace'] = new BaseTransformer({
    name: 'Monospace',
    priority: 85,
    category: 'unicode',
    map: {
        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒',
        'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛',
        's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸',
        'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁',
        'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    },
    // Detector: Check for monospace Unicode characters
    detector: function(text) {
        // Monospace characters
        return /[𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿]/.test(text);
    }
});

// doubleStruck (from unicode-styles/doubleStruck.js)
transforms['doubleStruck'] = new BaseTransformer({
    name: 'Double-Struck',
    priority: 85,
    category: 'unicode',
    map: {
        'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚',
        'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣',
        's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
        'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀',
        'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ',
        'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
        '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    },
    // Detector: Check for double-struck Unicode characters
    detector: function(text) {
        // Double-struck (blackboard bold) characters
        return /[𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹𝔻𝔼𝔽𝔾𝕀𝕁𝕂𝕃𝕄𝕆𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℂℍℕℙℚℝℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡]/.test(text);
    }
});

// mathematical (from unicode-styles/mathematical.js)
transforms['mathematical'] = new BaseTransformer({

        name: 'Mathematical Notation',
    priority: 85,
    category: 'unicode-styles',
        map: {
            'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾',
            'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇',
            's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
            'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ',
            'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ',
            'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        },
    // Detector: Check for mathematical script characters
    detector: function(text) {
        // Mathematical script characters (similar to cursive but distinct)
        return /[𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵]/u.test(text);
    }

});

// fraktur (from unicode-styles/fraktur.js)
transforms['fraktur'] = new BaseTransformer({

        name: 'Fraktur',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            const capMap = {
                'A': 0x1D504, 'B': 0x1D505, 'C': 0x212D, 'D': 0x1D507, 'E': 0x1D508, 'F': 0x1D509, 'G': 0x1D50A,
                'H': 0x210C, 'I': 0x2111, 'J': 0x1D50D, 'K': 0x1D50E, 'L': 0x1D50F, 'M': 0x1D510, 'N': 0x1D511,
                'O': 0x1D512, 'P': 0x1D513, 'Q': 0x1D514, 'R': 0x211C, 'S': 0x1D516, 'T': 0x1D517, 'U': 0x1D518,
                'V': 0x1D519, 'W': 0x1D51A, 'X': 0x1D51B, 'Y': 0x1D51C, 'Z': 0x2128
            };
            const lowerBase = 0x1D51E; // 'a'
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                if (c >= 'A' && c <= 'Z') {
                    const fr = capMap[c];
                    return fr ? String.fromCodePoint(fr) : c;
                }
                if (c >= 'a' && c <= 'z') {
                    return String.fromCodePoint(lowerBase + (code - 97));
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[fraktur]';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            const capMap = {
                0x1D504:'A',0x1D505:'B',0x212D:'C',0x1D507:'D',0x1D508:'E',0x1D509:'F',0x1D50A:'G',
                0x210C:'H',0x2111:'I',0x1D50D:'J',0x1D50E:'K',0x1D50F:'L',0x1D510:'M',0x1D511:'N',
                0x1D512:'O',0x1D513:'P',0x1D514:'Q',0x211C:'R',0x1D516:'S',0x1D517:'T',0x1D518:'U',
                0x1D519:'V',0x1D51A:'W',0x1D51B:'X',0x1D51C:'Y',0x2128:'Z'
            };
            const lowerBase = 0x1D51E;
            return Array.from(text).map(ch => {
                const cp = ch.codePointAt(0);
                if (cp in capMap) return capMap[cp];
                if (cp >= lowerBase && cp < lowerBase + 26) return String.fromCharCode(97 + (cp - lowerBase));
                return ch;
            }).join('');
        }

});

// superscript (from unicode-styles/superscript.js)
transforms['superscript'] = new BaseTransformer({

        name: 'Superscript',
    priority: 85,
    category: 'unicode-styles',
        map: {
            '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
            'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'ᵠ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ',
            'A':'ᴬ','B':'ᴮ','C':'ᶜ','D':'ᴰ','E':'ᴱ','F':'ᶠ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','Q':'ᵠ','R':'ᴿ','S':'ˢ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ','X':'ˣ','Y':'ʸ','Z':'ᶻ'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[super]';
            return this.func(text.slice(0, 4)) + (text.length > 4 ? '...' : '');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [k,v] of Object.entries(this.map)) revMap[v] = k;
            return [...text].map(c => revMap[c] || c).join('');
        }

});

// subscript (from unicode-styles/subscript.js)
transforms['subscript'] = new BaseTransformer({

        name: 'Subscript',
    priority: 85,
    category: 'unicode-styles',
        map: {
            '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
            'a':'ₐ','e':'ₑ','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','x':'ₓ'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[sub]';
            return this.func(text.slice(0, 4)) + (text.length > 4 ? '...' : '');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [k,v] of Object.entries(this.map)) revMap[v] = k;
            return [...text].map(c => revMap[c] || c).join('');
        }

});

// mirror (from unicode-styles/mirror.js)
transforms['mirror'] = new BaseTransformer({

        name: 'Mirror Text',
    priority: 85,
    category: 'unicode-styles',
        func: function(text) {
            return [...text].reverse().join('');
        },
        preview: function(text) {
            if (!text) return '[math]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            return this.func(text); // Mirror is its own inverse
        }

});

// reverse (from text-formatting/reverse.js)
transforms['reverse'] = new BaseTransformer({

        name: 'Reverse Text',
    priority: 40,
    category: 'text-formatting',
        func: function(text) {
            return [...text].reverse().join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            return this.func(text); // Reversing is its own inverse
        }

});

// alternating_case (from text-formatting/alternating-case.js)
transforms['alternating_case'] = new BaseTransformer({

        name: 'Alternating Case',
    priority: 150,  // Higher priority to detect before Base64
    category: 'text-formatting',
        func: function(text) {
            let upper = true;
            return [...text].map(c => {
                if (/[a-zA-Z]/.test(c)) {
                    const out = upper ? c.toUpperCase() : c.toLowerCase();
                    upper = !upper; 
                    return out;
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            if (!text) return '[alt case]';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            // Reverse by lowercasing (loses original case pattern)
            return text.toLowerCase();
        },
        detector: function(text) {
            const cleaned = text.trim();
            if (cleaned.length < 4) return false;
            
            // Check for alternating pattern in letters only
            let lastWasUpper = null;
            let alternations = 0;
            let letterCount = 0;
            
            for (const char of cleaned) {
                if (/[a-zA-Z]/.test(char)) {
                    const isUpper = char === char.toUpperCase();
                    if (lastWasUpper !== null && isUpper !== lastWasUpper) {
                        alternations++;
                    }
                    lastWasUpper = isUpper;
                    letterCount++;
                }
            }
            
            // Must have at least 3 alternations and at least 70% alternation rate
            return letterCount >= 4 && alternations >= 3 && alternations >= letterCount * 0.7;
        }

});

// title_case (from text-formatting/title-case.js)
transforms['title_case'] = new BaseTransformer({

        name: 'Title Case',
    priority: 150,  // Higher priority to detect before Base64
    category: 'text-formatting',
        func: function(text) {
            return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        },
        preview: function(text) {
            if (!text) return '[Title Case]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }

});

// sentence_case (from text-formatting/sentence-case.js)
transforms['sentence_case'] = new BaseTransformer({

        name: 'Sentence Case',
    priority: 150,  // Higher priority to detect before Base64
    category: 'text-formatting',
        func: function(text) {
            if (!text) return '';
            const lower = text.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        },
        preview: function(text) {
            if (!text) return '[Sentence]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }

});

// camel_case (from text-formatting/camel-case.js)
transforms['camel_case'] = new BaseTransformer({

        name: 'camelCase',
    priority: 275,
    category: 'text-formatting',
        func: function(text) {
            const parts = text.split(/[^a-zA-Z0-9]+/).filter(Boolean);
            if (parts.length === 0) return '';
            const first = parts[0].toLowerCase();
            const rest = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('');
            return first + rest;
        },
        preview: function(text) {
            if (!text) return '[camel]';
            return this.func(text);
        }

});

// snake_case (from text-formatting/snake-case.js)
transforms['snake_case'] = new BaseTransformer({

        name: 'snake_case',
    priority: 280,
    category: 'text-formatting',
        func: function(text) {
            return text.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s.toLowerCase()).join('_');
        },
        preview: function(text) {
            if (!text) return '[snake]';
            return this.func(text);
        },
        // Detector: Look for lowercase alphanumeric words separated by underscores
        detector: function(text) {
            const cleaned = text.trim();
            // Must have at least one underscore and only lowercase letters, numbers, and underscores
            if (!/^[a-z0-9]+(_[a-z0-9]+)+$/.test(cleaned)) return false;
            
            // Must contain at least some letters (not just numbers)
            return /[a-z]/.test(cleaned);
        },
        // Reverse: Replace underscores with spaces
        reverse: function(text) {
            return text.replace(/_/g, ' ');
        }

});

// kebab_case (from text-formatting/kebab-case.js)
transforms['kebab_case'] = new BaseTransformer({

        name: 'kebab-case',
    priority: 280,
    category: 'text-formatting',
        func: function(text) {
            return text.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s.toLowerCase()).join('-');
        },
        preview: function(text) {
            if (!text) return '[kebab]';
            return this.func(text);
        },
        // Detector: Look for lowercase alphanumeric words separated by hyphens
        detector: function(text) {
            const cleaned = text.trim();
            // Must have at least one hyphen and only lowercase letters, numbers, and hyphens
            if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(cleaned)) return false;
            
            // Exclude A1Z26 (all numbers 1-26)
            const parts = cleaned.split('-');
            const allValidA1Z26 = parts.every(p => {
                const num = parseInt(p, 10);
                return !isNaN(num) && num >= 1 && num <= 26;
            });
            if (allValidA1Z26 && parts.length > 1) return false;  // Likely A1Z26
            
            // Must contain at least some letters (not just numbers)
            return /[a-z]/.test(cleaned);
        },
        // Reverse: Replace hyphens with spaces
        reverse: function(text) {
            return text.replace(/-/g, ' ');
        }

});

// random_case (from text-formatting/random-case.js)
transforms['random_case'] = new BaseTransformer({

        name: 'Random Case',
    priority: 40,
    category: 'text-formatting',
        func: function(text) {
            return [...text].map(c => /[a-z]/i.test(c) ? (Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()) : c).join('');
        },
        preview: function(text) {
            if (!text) return '[RaNdOm]';
            return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
        }

});

// reverse_words (from text-formatting/reverse-words.js)
transforms['reverse_words'] = new BaseTransformer({

        name: 'Reverse Words',
    priority: 40,
    category: 'text-formatting',
        func: function(text) {
            return text.split(/(\s+)/).reverse().join('');
        },
        preview: function(text) {
            if (!text) return '[rev words]';
            // Take last 2-3 words and reverse them to show the effect
            const words = text.split(/\s+/);
            const lastWords = words.slice(-3).join(' ');
            return this.func(lastWords) + '...';
        },
        reverse: function(text) {
            // Reversing words twice restores
            return this.func(text);
        }

});

// pigLatin (from text-formatting/pigLatin.js)
transforms['pigLatin'] = new BaseTransformer({
    name: 'Pig Latin',
    priority: 285,
    category: 'text-formatting',
    
    // Detector: Look for words ending in "ay" or "way" (Pig Latin pattern)
    detector: function(text) {
        if (!/[a-z]/i.test(text)) return false;
        
        const words = text.toLowerCase().split(/\s+/);
        if (words.length < 2) return false;
        
        let ayEndingCount = 0;
        for (const word of words) {
            const cleanWord = word.replace(/[^a-z]/g, '');
            if (cleanWord.endsWith('ay') || cleanWord.endsWith('way')) {
                ayEndingCount++;
            }
        }
        
        // If more than 50% of words end in "ay" or "way", it's likely Pig Latin
        const ratio = ayEndingCount / words.length;
        return ratio >= 0.5;
    },
    
    func: function(text) {
            return text.split(/\s+/).map(word => {
                if (!word) return '';
                
                // Check if the word starts with a vowel
                if (/^[aeiou]/i.test(word)) {
                    return word + 'way';
                }
                
                // Handle consonant clusters at the beginning
                const match = word.match(/^([^aeiou]+)(.*)/i);
                if (match) {
                    return match[2] + match[1] + 'ay';
                }
                
                return word;
            }).join(' ');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            return text.split(/\s+/).map(word => {
                if (!word) return '';
                
                // Handle words ending in 'way'
                // Ambiguity: could be vowel+"way" OR consonant-moved+"w"+"ay"
                if (word.endsWith('way') && word.length > 3) {
                    const base = word.slice(0, -3);
                    
                    // Try both possibilities
                    const option1 = base; // Assume vowel-starting word
                    const option2 = 'w' + base; // Assume "w" was moved
                    
                    // Re-encode both and see which matches
                    const test1 = (/^[aeiou]/i.test(option1)) ? option1 + 'way' : null;
                    const test2 = option2.match(/^([^aeiou]+)(.*)/i);
                    const reencoded2 = test2 ? test2[2] + test2[1] + 'ay' : null;
                    
                    // If only one matches, use it
                    if (test1 === word && reencoded2 !== word) return option1;
                    if (reencoded2 === word && test1 !== word) return option2;
                    
                    // If both match (ambiguous), use heuristics:
                    // 1. Very short bases (1-2 chars) are likely complete words: "is", "a", "I"
                    if (test1 === word && reencoded2 === word && base.length <= 2) {
                        return option1; // base without "w"
                    }
                    // 2. Prefer "w" + base if base starts with vowel AND ends with consonant AND longer
                    // e.g., "world" (orld), "win" (in) but NOT "away" (away)
                    if (test1 === word && reencoded2 === word && 
                        /^[aeiou]/i.test(base) && /[bcdfghjklmnpqrstvwxyz]$/i.test(base)) {
                        return option2; // w + base
                    }
                    
                    // Fallback
                    return /^[aeiou]/i.test(base) ? base : 'w' + base;
                }
                
                // Handle words ending in 'ay' (but not 'way')
                if (word.endsWith('ay') && !word.endsWith('way') && word.length > 2) {
                    const base = word.slice(0, -2);
                    
                    // If base contains non-letter characters, return as-is
                    if (!/^[a-z]+$/i.test(base)) {
                        return word;
                    }
                    
                    // Try different consonant cluster lengths and score them
                    const commonClusters = ['th', 'ch', 'sh', 'wh', 'ph', 'gh', 'ck', 'ng', 'qu',
                                           'str', 'spr', 'thr', 'chr', 'scr', 'squ', 'spl', 'shr'];
                    let bestOption = null;
                    let bestScore = -1;
                    
                    for (let i = 1; i < base.length; i++) {
                        const cluster = base.slice(-i);
                        const remaining = base.slice(0, -i);
                        
                        // Must be all consonants and remaining must start with vowel
                        if (remaining.length > 0 &&
                            /^[bcdfghjklmnpqrstvwxyz]+$/i.test(cluster) && 
                            /^[aeiou]/i.test(remaining)) {
                            
                            let score = 0;
                            
                            // Prefer common multi-consonant clusters (score 10)
                            if (commonClusters.includes(cluster.toLowerCase())) {
                                score = 10;
                            }
                            // Prefer 2-3 letter clusters over single letters (score 5)
                            else if (cluster.length >= 2 && cluster.length <= 3) {
                                score = 5;
                            }
                            // Single consonants get lower score (score 2)
                            else if (cluster.length === 1) {
                                score = 2;
                            }
                            // Very long clusters are unlikely (score 1)
                            else {
                                score = 1;
                            }
                            
                            if (score > bestScore) {
                                bestScore = score;
                                bestOption = cluster + remaining;
                            }
                        }
                    }
                    
                    if (bestOption) return bestOption;
                }
                
                return word;
            }).join(' ');
        }

});

// ubbi_dubbi (from text-formatting/ubbi-dubbi.js)
transforms['ubbi_dubbi'] = new BaseTransformer({

        name: 'Ubbi Dubbi',
    priority: 40,
    category: 'text-formatting',
        func: function(text) {
            // Insert 'ub' before vowels (simple, reversible scheme)
            return text.replace(/([AEIOUaeiou])/g, 'ub$1');
        },
        preview: function(text) {
            if (!text) return 'hubellubo';
            return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
        },
        reverse: function(text) {
            return text.replace(/ub([AEIOUaeiou])/g, '$1');
        }

});

// rovarspraket (from text-formatting/rovarspraket.js)
transforms['rovarspraket'] = new BaseTransformer({

        name: 'Rövarspråket',
    priority: 40,
    category: 'text-formatting',
        isConsonant: function(c) { return /[bcdfghjklmnpqrstvwxyz]/i.test(c); },
        func: function(text) {
            return [...text].map(ch => this.isConsonant(ch) ? (ch + 'o' + ch) : ch).join('');
        },
        preview: function(text) {
            if (!text) return 'totexxtot';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            // Collapse consonant-o-consonant patterns where the two consonants match
            return text.replace(/([bcdfghjklmnpqrstvwxyz])o\1/gi, '$1');
        }

});

// disemvowel (from text-formatting/disemvowel.js)
transforms['disemvowel'] = new BaseTransformer({

        name: 'Disemvowel',
    priority: 40,
    category: 'text-formatting',
        func: function(text) {
            return text.replace(/[aeiouAEIOU]/g, '');
        },
        preview: function(text) {
            if (!text) return '[dsmvwl]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }

});

// leetspeak (from text-formatting/leetspeak.js)
transforms['leetspeak'] = new BaseTransformer({

        name: 'Leetspeak',
    priority: 40,
    category: 'text-formatting',
        map: {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1',
            'A': '4', 'E': '3', 'I': '1', 'O': '0', 'S': '5', 'T': '7', 'L': '1'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[double-struck]';
            return this.func(text.slice(0, 3)) + '...';
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key.toLowerCase();
            }
            return revMap;
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return [...text].map(c => revMap[c] || c).join('');
        }

});

// url (from text-formatting/url.js)
transforms['url'] = new BaseTransformer({
    name: 'URL Encode',
    priority: 40,
    category: 'text-formatting',
    
    // Detector: Look for %XX pattern (URL encoding)
    detector: function(text) {
        return text.includes('%') && /%[0-9A-Fa-f]{2}/.test(text);
    },
    
    func: function(text) {
            try {
                return encodeURIComponent(text);
            } catch (e) {
                // Catch malformed Unicode or unpaired surrogates
                return '[Invalid input]';
            }
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            try {
                return decodeURIComponent(text);
            } catch (e) {
                return text;
            }
        }

});

// html (from text-formatting/html.js)
transforms['html'] = new BaseTransformer({
    name: 'HTML Entities',
    priority: 40,
    category: 'text-formatting',
    
    // Detector: Look for &...; pattern (HTML entities)
    detector: function(text) {
        return text.includes('&') && text.includes(';') && /&[a-zA-Z0-9#]+;/.test(text);
    },
    
    func: function(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            return text
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, '\'');
        }

});

// qwerty_shift (from text-formatting/qwerty-shift.js)
transforms['qwerty_shift'] = new BaseTransformer({

        name: 'QWERTY Right Shift',
    priority: 40,
    category: 'text-formatting',
        rows: [
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
        ],
        buildMap: function() {
            if (this._map) return this._map;
            const map = {};
            for (const row of this.rows) {
                for (let i=0;i<row.length;i++) {
                    const from = row[i], to = row[(i+1)%row.length];
                    map[from] = to;
                    map[from.toUpperCase()] = to.toUpperCase();
                }
            }
            this._map = map; return map;
        },
        func: function(text) {
            const m = this.buildMap();
            return [...text].map(c => m[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[qwerty]';
            return this.func(text.slice(0,8)) + (text.length>8?'...':'');
        },
        reverse: function(text) {
            const m = this.buildMap();
            const inv = {};
            Object.keys(m).forEach(k => inv[m[k]] = k);
            return [...text].map(c => inv[c] || c).join('');
        }

});

// morse (from languages/morse.js)
transforms['morse'] = new BaseTransformer({
    name: 'Morse Code',
    priority: 300,
    category: 'languages',
    
    // Detector: Only dots, dashes, slashes, and spaces
    detector: function(text) {
        const cleaned = text.trim();
        return cleaned.length >= 5 && /^[\.\-\/\s]+$/.test(cleaned);
    },
    
    map: {
            // Letters
            'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
            'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
            'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
            's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
            'y': '-.--', 'z': '--..',
            // Numbers
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            // Punctuation
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
            '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
            ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
            '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return revMap;
        },
        func: function(text, decode = false) {
            if (decode) {
                // Decode mode
                const revMap = this.reverseMap();
                // Split by word separator (/ or multiple spaces) and then by character separator (single space)
                return text.split(/\s*\/\s*|\s{3,}/).map(word => 
                    word.split(/\s+/).map(code => revMap[code] || '').join('')
                ).join(' ');
            } else {
                // Encode mode - handle word boundaries with /
                return text.split(/\s+/).map(word => 
                    [...word.toLowerCase()].map(c => this.map[c] || '').filter(x => x).join(' ')
                ).join(' / ');
            }
        },
        preview: function(text) {
            if (!text) return '[base32]';
            const result = this.func(text.slice(0, 2));
            return result + '...';
        },
        reverse: function(text) {
            return this.func(text, true);
        }

});

// braille (from languages/braille.js)
transforms['braille'] = new BaseTransformer({
    name: 'Braille',
    priority: 300,
    category: 'languages',
    
    // Detector: Must contain Braille characters (allows other chars too since braille doesn't encode everything)
    detector: function(text) {
        const cleaned = text.trim();
        // Must contain at least 2 braille characters
        const brailleCount = (cleaned.match(/[⠀-⣿]/g) || []).length;
        return brailleCount >= 2;
    },
    
    map: {
            'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊',
            'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗',
            's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
            '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
            '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            // Build reverse map
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            
            // Decode character by character
            // Handle multi-character sequences (numbers use ⠼ prefix)
            let result = '';
            let i = 0;
            while (i < text.length) {
                // Check for number indicator (⠼)
                if (text[i] === '⠼' && i + 1 < text.length) {
                    const twoChar = text[i] + text[i + 1];
                    if (revMap[twoChar]) {
                        result += revMap[twoChar];
                        i += 2;
                        continue;
                    }
                }
                
                // Single character lookup
                const char = text[i];
                result += revMap[char] || char;
                i++;
            }
            
            return result;
        }

});

// nato (from languages/nato.js)
transforms['nato'] = new BaseTransformer({

        name: 'NATO Phonetic',
    priority: 300,
    category: 'languages',
        map: {
            'a': 'Alpha', 'b': 'Bravo', 'c': 'Charlie', 'd': 'Delta', 'e': 'Echo',
            'f': 'Foxtrot', 'g': 'Golf', 'h': 'Hotel', 'i': 'India', 'j': 'Juliett',
            'k': 'Kilo', 'l': 'Lima', 'm': 'Mike', 'n': 'November', 'o': 'Oscar',
            'p': 'Papa', 'q': 'Quebec', 'r': 'Romeo', 's': 'Sierra', 't': 'Tango',
            'u': 'Uniform', 'v': 'Victor', 'w': 'Whiskey', 'x': 'X-ray', 'y': 'Yankee', 'z': 'Zulu',
            '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
            '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
        },
        func: function(text) {
            // Use | to mark word boundaries
            return [...text.toLowerCase()].map(c => {
                if (c === ' ') return '|';
                return this.map[c] || c;
            }).join(' ');
        },
        preview: function(text) {
            if (!text) return '[quenya]';
            return this.func(text.slice(0, 3)) + '...';
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value.toLowerCase()] = key;
            }
            return revMap;
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return text.split(/\s+/).map(word => {
                if (word === '|') return ' ';
                return revMap[word.toLowerCase()] || word;
            }).join('');
        }

});

// tap_code (from languages/tap-code.js)
transforms['tap_code'] = new BaseTransformer({
    name: 'Tap Code',
    priority: 300,
    category: 'languages',
    
    // Detector: Must contain mostly dots, spaces, and slashes (allow other chars like emojis/numbers)
    detector: function(text) {
        const cleaned = text.trim();
        if (cleaned.length < 3) return false;
        // Count tap code characters (dots, spaces, slashes)
        const tapChars = (cleaned.match(/[\.\s\/]/g) || []).length;
        // Must be at least 70% tap code characters
        return tapChars / cleaned.length > 0.7;
    },
    
    letters: 'ABCDEFGHIKLMNOPQRSTUVWXYZ', // no J (traditionally K merges with C or J omitted; use no J)
        buildMap: function() {
            if (this._map) return this._map;
            const map = {}; const rev = {};
            for (let i=0;i<this.letters.length;i++) {
                const r = Math.floor(i/5)+1; const c = (i%5)+1;
                map[this.letters[i]] = [r,c];
                rev[`${r},${c}`] = this.letters[i];
            }
            this._map = map; this._rev = rev; return map;
        },
        func: function(text) {
            this.buildMap();
            const out = [];
            for (const ch of text.toUpperCase()) {
                if (ch === 'J') { // common convention: J -> I
                    const [r,c] = this._map['I']; out.push('.'.repeat(r)+'.'+'.'.repeat(c)); continue;
                }
                const coords = this._map[ch];
                if (coords) {
                    out.push('.'.repeat(coords[0]) + ' ' + '.'.repeat(coords[1]));
                } else if (/\s/.test(ch)) {
                    out.push('/');
                } else {
                    out.push(ch);
                }
            }
            return out.join(' ');
        },
        preview: function(text) {
            return this.func((text || 'tap').slice(0,3));
        },
        reverse: function(text) {
            this.buildMap();
            const toks = text.trim().split(/\s+/);
            const out = [];
            for (let i=0;i<toks.length;i++) {
                const a = toks[i];
                if (a === '/') { out.push(' '); continue; }
                if (/^\.+$/.test(a) && i+1 < toks.length && /^\.+$/.test(toks[i+1])) {
                    const key = `${a.length},${toks[i+1].length}`;
                    const ch = this._rev[key] || '?';
                    out.push(ch);
                    i++;
                } else {
                    out.push(a);
                }
            }
            return out.join('');
        }

});

// a1z26 (from languages/a1z26.js)
transforms['a1z26'] = new BaseTransformer({
    name: 'A1Z26',
    priority: 275,
    category: 'languages',
    
    // Detector: Check for A1Z26 pattern (numbers 1-26 separated by hyphens, words by spaces)
    detector: function(text) {
        const cleaned = text.trim();
        if (cleaned.length < 3) return false;
        
        // Must contain only digits, hyphens, and spaces
        if (!/^[0-9\-\s]+$/.test(cleaned)) return false;
        
        // Check if numbers are in valid A1Z26 range (1-26)
        const numbers = cleaned.split(/[-\s]+/).filter(n => n.length > 0);
        if (numbers.length === 0) return false;
        
        // At least 50% of numbers should be in 1-26 range (allows some flexibility)
        const validCount = numbers.filter(n => {
            const num = parseInt(n, 10);
            return !isNaN(num) && num >= 1 && num <= 26;
        }).length;
        
        return validCount / numbers.length >= 0.5;
    },
    
    func: function(text) {
            // Encode letters as numbers with hyphens, strip everything else (standard A1Z26)
            const letters = text.replace(/[^A-Za-z]/g, '');
            if (!letters) return '';
            return letters.split('').map(c => {
                const n = (c.toUpperCase().charCodeAt(0) - 64);
                return String(n);
            }).join('-');
        },
        preview: function(text) {
            if (!text) return '[1-26]';
            const full = this.func(text);
            return full.substring(0, 20) + (full.length > 20 ? '...' : '');
        },
        reverse: function(text) {
            // Decode numbers back to letters (standard A1Z26: strips spaces)
            return text.split(/[-\s,.\|\/]+/).filter(tok => tok).map(tok => {
                const n = parseInt(tok, 10);
                if (n >= 1 && n <= 26) {
                    return String.fromCharCode(64 + n).toLowerCase();
                }
                return '';
            }).join('');
        }

});

// semaphore (from languages/semaphore.js)
transforms['semaphore'] = new BaseTransformer({
    name: 'Semaphore Flags',
    priority: 310,
    category: 'languages',
    
    // Detector: Only uses 8 specific arrow emojis (most exclusive character set)
    detector: function(text) {
        const cleaned = text.trim();
        return cleaned.length >= 2 && /^[⬆️↗️➡️↘️⬇️↙️⬅️↖️⬆↗➡↘⬇↙⬅↖\s\/]+$/u.test(cleaned);
    },
    
    // Positions 1..8 around the clock: 1=⬆️ 2=↗️ 3=➡️ 4=↘️ 5=⬇️ 6=↙️ 7=⬅️ 8=↖️
    arrows: ['','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️'],
        // Standard semaphore mapping (J is special: 2-1)
        table: {
            'A':[1,2],'B':[1,3],'C':[1,4],'D':[1,5],'E':[1,6],'F':[1,7],'G':[1,8],
            'H':[2,3],'I':[2,4],'J':[2,1],
            'K':[2,5],'L':[2,6],'M':[2,7],'N':[2,8],
            'O':[3,4],'P':[3,5],'Q':[3,6],'R':[3,7],'S':[3,8],
            'T':[4,5],'U':[4,6],'V':[4,7],'W':[4,8],
            'X':[5,6],'Y':[5,7],'Z':[5,8]
        },
        encodePair: function(pair) { return this.arrows[pair[0]] + this.arrows[pair[1]]; },
        buildReverse: function() {
            if (this._rev) return this._rev;
            const rev = {};
            for (const [k,v] of Object.entries(this.table)) {
                rev[this.encodePair(v)] = k;
            }
            this._rev = rev; return rev;
        },
        func: function(text) {
            return [...text].map(ch => {
                if (/\s/.test(ch)) return '/';
                const up = ch.toUpperCase();
                const pair = this.table[up];
                return pair ? this.encodePair(pair) : ch;
            }).join(' ');
        },
        preview: function(text) {
            return this.func((text || 'flag').slice(0, 4));
        },
        reverse: function(text) {
            const rev = this.buildReverse();
            const tokens = text.trim().split(/\s+/);
            return tokens.map(tok => {
                if (tok === '/') return ' ';
                // Some platforms add variation selectors; normalize by direct match first
                return rev[tok] || tok;
            }).join('');
        }

});

// elder_futhark (from fantasy/elder-futhark.js)
transforms['elder_futhark'] = new BaseTransformer({

        name: 'Elder Futhark',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚳ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
            'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲᚹ', 'r': 'ᚱ',
            's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚡ', 'w': 'ᚹ', 'x': 'ᚳᛋ', 'y': 'ᚤ', 'z': 'ᛉ'
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return revMap;
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[runes]';
            return this.func(text.slice(0, 5));
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return [...text].map(c => revMap[c] || c).join('');
        },
        // Detector: Check for Elder Futhark runes
        detector: function(text) {
            // Elder Futhark runes (U+16A0-U+16F8)
            // Check for the unique runes used in this transform
            return /[ᚨᚳᚲᛟᚤᛒᛞᛖᚠᚷᚺᛁᛃᛚᛗᚾᛈᛩᚱᛋᛏᚢᚡᚹᛉ]/.test(text);
        }

});

// quenya (from fantasy/quenya.js)
transforms['quenya'] = new BaseTransformer({

        name: 'Quenya (Tolkien Elvish)',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': 'a', 'b': 'v', 'c': 'k', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i',
            'j': 'y', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'kw', 'r': 'r',
            's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'y', 'z': 'z',
            'A': 'A', 'B': 'V', 'C': 'K', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I',
            'J': 'Y', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'KW', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'KS', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            // Create reverse map
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        },
        // Detector: Check for Quenya patterns
        detector: function(text) {
            // Quenya has characteristic patterns like 'kw' and 'ks', but since the encoding is mostly
            // 1:1 (b->v, c->k, j->y, q->kw, x->ks), we look for multiple instances of these patterns
            const patterns = text.match(/kw|ks/gi);
            // If there are at least 1 multi-char pattern, it's likely Quenya
            return patterns && patterns.length >= 1;
        }

});

// tengwar (from fantasy/tengwar.js)
transforms['tengwar'] = new BaseTransformer({

        name: 'Tengwar Script',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': 'ᚪ', 'b': 'ᛒ', 'c': 'ᛣ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
            'j': 'ᛃ', 'k': 'ᛣ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᚩ', 'p': 'ᛈ', 'q': 'ᛩ', 'r': 'ᚱ',
            's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚡ', 'w': 'ᚹ', 'x': 'ᛉ', 'y': 'ᚣ', 'z': 'ᛉ',
            'A': 'ᚪ', 'B': 'ᛒ', 'C': 'ᛣ', 'D': 'ᛞ', 'E': 'ᛖ', 'F': 'ᚠ', 'G': 'ᚷ', 'H': 'ᚺ', 'I': 'ᛁ',
            'J': 'ᛃ', 'K': 'ᛣ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᚩ', 'P': 'ᛈ', 'Q': 'ᛩ', 'R': 'ᚱ',
            'S': 'ᛋ', 'T': 'ᛏ', 'U': 'ᚢ', 'V': 'ᚡ', 'W': 'ᚹ', 'X': 'ᛉ', 'Y': 'ᚣ', 'Z': 'ᛉ'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        },
        // Detector: Check for Tengwar Script characters
        detector: function(text) {
            // Tengwar has unique characters like ᚪ, ᛣ, ᚩ, ᛩ, ᚣ
            return /[ᚪᛣᚩᛩᚣᛒᛞᛖᚠᚷᚺᛁᛃᛚᛗᚾᛈᚱᛋᛏᚢᚡᚹᛉ]/.test(text);
        }

});

// klingon (from fantasy/klingon.js)
transforms['klingon'] = new BaseTransformer({

        name: 'Klingon',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': 'a', 'b': 'b', 'c': 'ch', 'd': 'D', 'e': 'e', 'f': 'f', 'g': 'gh', 'h': 'H', 'i': 'I',
            'j': 'j', 'k': 'q', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'Q', 'r': 'r',
            's': 'S', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
            'A': 'A', 'B': 'B', 'C': 'CH', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'GH', 'H': 'H', 'I': 'I',
            'J': 'J', 'K': 'Q', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            // Process character by character, preserving case
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[klingon]';
            return this.func(text.slice(0, 8));
        },
        reverse: function(text) {
            // Build reverse map with multi-character strings
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            // Try to match multi-character sequences first, then single chars
            let result = '';
            let i = 0;
            while (i < text.length) {
                // Try 2-character match first (for 'ch', 'gh', 'CH', 'GH')
                const twoChar = text.substr(i, 2);
                if (revMap[twoChar]) {
                    result += revMap[twoChar];
                    i += 2;
                } else if (revMap[text[i]]) {
                    result += revMap[text[i]];
                    i++;
                } else {
                    result += text[i];
                    i++;
                }
            }
            return result;
        },
        // Detector: Check for Klingon patterns
        detector: function(text) {
            // Klingon has characteristic patterns like 'ch', 'gh', 'Q' (capital Q for q sound)
            // Also uses capital letters in specific ways (D, H, I, Q, S)
            const patterns = text.match(/ch|gh|CH|GH/g);
            const capitalPattern = /[DHIQS]/.test(text) && /[a-z]/.test(text); // Mix of specific capitals with lowercase
            return (patterns && patterns.length >= 1) || capitalPattern;
        }

});

// dovahzul (from fantasy/dovahzul.js)
transforms['dovahzul'] = new BaseTransformer({
    name: 'Dovahzul (Dragon)',
    priority: 285,
    category: 'fantasy',
    
    // Detector: Look for characteristic Dovahzul patterns (vowel expansions)
    detector: function(text) {
        if (!/[a-z]/i.test(text)) return false;
        
        const dovahzulPatterns = ['ah', 'eh', 'ii', 'kw', 'ks'];
        let patternCount = 0;
        const lowerInput = text.toLowerCase();
        
        for (const pattern of dovahzulPatterns) {
            const matches = lowerInput.match(new RegExp(pattern, 'g'));
            if (matches) patternCount += matches.length;
        }
        
        // For short inputs, require at least 1 pattern, for longer require 2+
        const minPatterns = text.length < 30 ? 1 : 2;
        return patternCount >= minPatterns;
    },
    
    map: {
            'a': 'ah', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'eh', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'ii',
            'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'kw', 'r': 'r',
            's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'y', 'z': 'z',
            'A': 'AH', 'B': 'B', 'C': 'K', 'D': 'D', 'E': 'EH', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'II',
            'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'KW', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'KS', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            // Build reverse map from multi-character sequences to single chars
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value.toLowerCase()] = key.toLowerCase();
            }
            
            // Sort by length (longest first) to match multi-char sequences first
            const patterns = Object.keys(revMap).sort((a, b) => b.length - a.length);
            
            let result = text.toLowerCase();
            // Replace multi-character patterns with their original characters
            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'g');
                result = result.replace(regex, revMap[pattern]);
            }
            
            return result;
        }

});

// aurebesh (from fantasy/aurebesh.js)
transforms['aurebesh'] = new BaseTransformer({

        name: 'Aurebesh (Star Wars)',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': 'Aurek', 'b': 'Besh', 'c': 'Cresh', 'd': 'Dorn', 'e': 'Esk', 'f': 'Forn', 'g': 'Grek', 'h': 'Herf', 'i': 'Isk',
            'j': 'Jenth', 'k': 'Krill', 'l': 'Leth', 'm': 'Mern', 'n': 'Nern', 'o': 'Osk', 'p': 'Peth', 'q': 'Qek', 'r': 'Resh',
            's': 'Senth', 't': 'Trill', 'u': 'Usk', 'v': 'Vev', 'w': 'Wesk', 'x': 'Xesh', 'y': 'Yirt', 'z': 'Zerek',
            'A': 'AUREK', 'B': 'BESH', 'C': 'CRESH', 'D': 'DORN', 'E': 'ESK', 'F': 'FORN', 'G': 'GREK', 'H': 'HERF', 'I': 'ISK',
            'J': 'JENTH', 'K': 'KRILL', 'L': 'LETH', 'M': 'MERN', 'N': 'NERN', 'O': 'OSK', 'P': 'PETH', 'Q': 'QEK', 'R': 'RESH',
            'S': 'SENTH', 'T': 'TRILL', 'U': 'USK', 'V': 'VEV', 'W': 'WESK', 'X': 'XESH', 'Y': 'YIRT', 'Z': 'ZEREK'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join(' ');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value.toLowerCase()] = key;
            }
            return text.split(/\s+/).map(word => revMap[word.toLowerCase()] || word).join('');
        },
        // Detector: Check for Aurebesh words
        detector: function(text) {
            // Aurebesh uses specific word patterns like "Aurek", "Besh", "Cresh", etc.
            const aurebeshWords = ['aurek', 'besh', 'cresh', 'dorn', 'esk', 'forn', 'grek', 'herf', 'isk',
                                   'jenth', 'krill', 'leth', 'mern', 'nern', 'osk', 'peth', 'qek', 'resh',
                                   'senth', 'trill', 'usk', 'vev', 'wesk', 'xesh', 'yirt', 'zerek'];
            const lowerText = text.toLowerCase();
            // Check if at least 2 Aurebesh words are present
            const matches = aurebeshWords.filter(word => lowerText.includes(word));
            return matches.length >= 2;
        }

});

// greek (from fantasy/greek.js)
transforms['greek'] = new BaseTransformer({
    name: 'Greek Letters',
    priority: 100,
    category: 'fantasy',
    
    // Detector: Look for Greek alphabet characters
    detector: function(text) {
        // Check if text contains Greek letters (α-ω, Α-Ω range)
        return /[α-ωΑ-Ωϐϑξ]/u.test(text);
    },
        map: {
            // Fixed ambiguous mappings: c→ξ (was χ), v→ϐ (was ς), x→χ stays
            'a': 'α', 'b': 'β', 'c': 'ξ', 'd': 'δ', 'e': 'ε', 'f': 'φ', 'g': 'γ', 'h': 'η',
            'i': 'ι', 'j': 'ϑ', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ο', 'p': 'π',
            'q': 'θ', 'r': 'ρ', 's': 'σ', 't': 'τ', 'u': 'υ', 'v': 'ϐ', 'w': 'ω', 'x': 'χ',
            'y': 'ψ', 'z': 'ζ',
            'A': 'Α', 'B': 'Β', 'C': 'Ξ', 'D': 'Δ', 'E': 'Ε', 'F': 'Φ', 'G': 'Γ', 'H': 'Η',
            'I': 'Ι', 'J': 'Θ', 'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Π',
            'Q': 'Θ', 'R': 'Ρ', 'S': 'Σ', 'T': 'Τ', 'U': 'Υ', 'V': 'ς', 'W': 'Ω', 'X': 'Χ',
            'Y': 'Ψ', 'Z': 'Ζ'
        },
        func: function(text) {
            return text.split('').map(char => this.map[char] || char).join('');
        },
        preview: function(text) {
            if (!text) return '[greek]';
            return this.func(text.slice(0, 10));
        },
        reverseMap: function() {
            if (!this._reverseMap) {
                this._reverseMap = {};
                for (let key in this.map) {
                    this._reverseMap[this.map[key]] = key;
                }
            }
            return this._reverseMap;
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return text.split('').map(char => revMap[char] || char).join('');
        }

});

// wingdings (from fantasy/wingdings.js)
transforms['wingdings'] = new BaseTransformer({

        name: 'Wingdings',
    priority: 100,
    category: 'fantasy',
        map: {
            'a': '♋', 'b': '♌', 'c': '♍', 'd': '♎', 'e': '♏', 'f': '♐', 'g': '♑', 'h': '♒',
            'i': '♓', 'j': '⛎', 'k': '☀', 'l': '☁', 'm': '☂', 'n': '☃', 'o': '☄', 'p': '★',
            'q': '☆', 'r': '☇', 's': '☈', 't': '☉', 'u': '☊', 'v': '☋', 'w': '☌', 'x': '☍',
            'y': '☎', 'z': '☏',
            'A': '♠', 'B': '♡', 'C': '♢', 'D': '♣', 'E': '♤', 'F': '♥', 'G': '♦', 'H': '♧',
            'I': '♨', 'J': '♩', 'K': '♪', 'L': '♫', 'M': '♬', 'N': '♭', 'O': '♮', 'P': '♯',
            'Q': '✁', 'R': '✂', 'S': '✃', 'T': '✄', 'U': '✆', 'V': '✇', 'W': '✈', 'X': '✉',
            'Y': '✌', 'Z': '✍',
            '0': '✓', '1': '✔', '2': '✕', '3': '✖', '4': '✗', '5': '✘', '6': '✙', '7': '✚',
            '8': '✛', '9': '✜',
            '.': '✠', ',': '✡', '?': '✢', '!': '✣', '@': '✤', '#': '✥', '$': '✦', '%': '✧',
            '^': '✩', '&': '✪', '*': '✫', '(': '✬', ')': '✭', '-': '✮', '_': '✯', '=': '✰',
            '+': '✱', '[': '✲', ']': '✳', '{': '✴', '}': '✵', '|': '✶', '\\': '✷', ';': '✸',
            ':': '✹', '"': '✺', '\'': '✻', '<': '✼', '>': '✽', '/': '✾', '~': '✿', '`': '❀'
        },
        func: function(text) {
            return text.split('').map(char => this.map[char] || char).join('');
        },
        preview: function(text) {
            if (!text) return '[wingdings]';
            return this.func(text.slice(0, 10));
        },
        reverseMap: function() {
            if (!this._reverseMap) {
                this._reverseMap = {};
                for (let key in this.map) {
                    this._reverseMap[this.map[key]] = key;
                }
            }
            return this._reverseMap;
        },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return text.split('').map(char => revMap[char] || char).join('');
        }

});

// cyrillic_stylized (from fantasy/cyrillic-stylized.js)
transforms['cyrillic_stylized'] = new BaseTransformer({

        name: 'Cyrillic Stylized',
    priority: 100,
    category: 'fantasy',
        map: {
            'A':'А','B':'В','C':'С','E':'Е','H':'Н','K':'К','M':'М','O':'О','P':'Р','T':'Т','X':'Х','Y':'У',
            'a':'а','e':'е','o':'о','p':'р','c':'с','y':'у','x':'х','k':'к','h':'һ','m':'м','t':'т','b':'Ь'
        },
        func: function(text) {
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[cyrillic]';
            return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
        },
        reverse: function(text) {
            const rev = {};
            for (const [k,v] of Object.entries(this.map)) rev[v] = k;
            return [...text].map(c => rev[c] || c).join('');
        }

});

// katakana (from fantasy/katakana.js)
transforms['katakana'] = new BaseTransformer({

        name: 'Katakana',
    priority: 100,
    category: 'fantasy',
        table: [
            ['kyo','キョ'],['kyu','キュ'],['kya','キャ'],
            ['sho','ショ'],['shu','シュ'],['sha','シャ'],['shi','シ'],
            ['cho','チョ'],['chu','チュ'],['cha','チャ'],['chi','チ'],
            ['tsu','ツ'],['fu','フ'],
            ['ryo','リョ'],['ryu','リュ'],['rya','リャ'],
            ['nyo','ニョ'],['nyu','ニュ'],['nya','ニャ'],
            ['gya','ギャ'],['gyu','ギュ'],['gyo','ギョ'],
            ['hya','ヒャ'],['hyu','ヒュ'],['hyo','ヒョ'],
            ['mya','ミャ'],['myu','ミュ'],['myo','ミョ'],
            ['pya','ピャ'],['pyu','ピュ'],['pyo','ピョ'],
            ['bya','ビャ'],['byu','ビュ'],['byo','ビョ'],
            ['ja','ジャ'],['ju','ジュ'],['jo','ジョ'],
            ['ka','カ'],['ki','キ'],['ku','ク'],['ke','ケ'],['ko','コ'],
            ['ga','ガ'],['gi','ギ'],['gu','グ'],['ge','ゲ'],['go','ゴ'],
            ['sa','サ'],['su','ス'],['se','セ'],['so','ソ'],
            ['za','ザ'],['zu','ズ'],['ze','ゼ'],['zo','ゾ'],
            ['ta','タ'],['te','テ'],['to','ト'],
            ['da','ダ'],['de','デ'],['do','ド'],
            ['na','ナ'],['ni','ニ'],['nu','ヌ'],['ne','ネ'],['no','ノ'],
            ['ha','ハ'],['hi','ヒ'],['he','ヘ'],['ho','ホ'],
            ['ba','バ'],['bi','ビ'],['bu','ブ'],['be','ベ'],['bo','ボ'],
            ['pa','パ'],['pi','ピ'],['pu','プ'],['pe','ペ'],['po','ポ'],
            ['ma','マ'],['mi','ミ'],['mu','ム'],['me','メ'],['mo','モ'],
            ['ra','ラ'],['ri','リ'],['ru','ル'],['re','レ'],['ro','ロ'],
            ['wa','ワ'],['wo','ヲ'],['n','ン'],
            ['a','ア'],['i','イ'],['u','ウ'],['e','エ'],['o','オ']
        ],
        func: function(text) {
            let i = 0, out = '';
            const lower = text.toLowerCase();
            const sorted = [...this.table].sort((a,b)=>b[0].length-a[0].length);
            while (i < lower.length) {
                let matched = false;
                for (const [rom,kana] of sorted) {
                    if (lower.startsWith(rom, i)) {
                        out += kana;
                        i += rom.length;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    out += text[i];
                    i += 1;
                }
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '[カタカナ]';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            const rev = {};
            for (const [rom,kana] of this.table) rev[kana] = rom;
            let out = '';
            for (const ch of text) out += (rev[ch] || ch);
            return out;
        }

});

// hiragana (from fantasy/hiragana.js)
transforms['hiragana'] = new BaseTransformer({

        name: 'Hiragana',
    priority: 100,
    category: 'fantasy',
        table: [
            ['kyo','きょ'],['kyu','きゅ'],['kya','きゃ'],
            ['sho','しょ'],['shu','しゅ'],['sha','しゃ'],['shi','し'],
            ['cho','ちょ'],['chu','ちゅ'],['cha','ちゃ'],['chi','ち'],
            ['tsu','つ'],['fu','ふ'],
            ['ryo','りょ'],['ryu','りゅ'],['rya','りゃ'],
            ['nyo','にょ'],['nyu','にゅ'],['nya','にゃ'],
            ['gya','ぎゃ'],['gyu','ぎゅ'],['gyo','ぎょ'],
            ['hya','ひゃ'],['hyu','ひゅ'],['hyo','ひょ'],
            ['mya','みゃ'],['myu','みゅ'],['myo','みょ'],
            ['pya','ぴゃ'],['pyu','ぴゅ'],['pyo','ぴょ'],
            ['bya','びゃ'],['byu','びゅ'],['byo','びょ'],
            ['ja','じゃ'],['ju','じゅ'],['jo','じょ'],
            ['ka','か'],['ki','き'],['ku','く'],['ke','け'],['ko','こ'],
            ['ga','が'],['gi','ぎ'],['gu','ぐ'],['ge','げ'],['go','ご'],
            ['sa','さ'],['su','す'],['se','せ'],['so','そ'],
            ['za','ざ'],['zu','ず'],['ze','ぜ'],['zo','ぞ'],
            ['ta','た'],['te','て'],['to','と'],
            ['da','だ'],['de','で'],['do','ど'],
            ['na','な'],['ni','に'],['nu','ぬ'],['ne','ね'],['no','の'],
            ['ha','は'],['hi','ひ'],['he','へ'],['ho','ほ'],
            ['ba','ば'],['bi','び'],['bu','ぶ'],['be','べ'],['bo','ぼ'],
            ['pa','ぱ'],['pi','ぴ'],['pu','ぷ'],['pe','ぺ'],['po','ぽ'],
            ['ma','ま'],['mi','み'],['mu','む'],['me','め'],['mo','も'],
            ['ra','ら'],['ri','り'],['ru','る'],['re','れ'],['ro','ろ'],
            ['wa','わ'],['wo','を'],['n','ん'],
            ['a','あ'],['i','い'],['u','う'],['e','え'],['o','お']
        ],
        func: function(text) {
            // reuse katakana logic with different table
            let i = 0, out = '';
            const lower = text.toLowerCase();
            const sorted = [...this.table].sort((a,b)=>b[0].length-a[0].length);
            while (i < lower.length) {
                let matched = false;
                for (const [rom,kana] of sorted) {
                    if (lower.startsWith(rom, i)) {
                        out += kana;
                        i += rom.length;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    out += text[i];
                    i += 1;
                }
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '[ひらがな]';
            return this.func(text.slice(0, 6)) + (text.length > 6 ? '...' : '');
        },
        reverse: function(text) {
            const rev = {};
            for (const [rom,kana] of this.table) rev[kana] = rom;
            let out = '';
            for (const ch of text) out += (rev[ch] || ch);
            return out;
        }

});

// hieroglyphics (from symbols/hieroglyphics.js)
transforms['hieroglyphics'] = new BaseTransformer({

        name: 'Hieroglyphics',
    priority: 70,
    category: 'symbols',
        map: {
            'a': '𓃭', 'b': '𓃮', 'c': '𓃯', 'd': '𓃰', 'e': '𓃱', 'f': '𓃲', 'g': '𓃳', 'h': '𓃴', 'i': '𓃵',
            'j': '𓃶', 'k': '𓃷', 'l': '𓃸', 'm': '𓃹', 'n': '𓃺', 'o': '𓃻', 'p': '𓃼', 'q': '𓃽', 'r': '𓃾',
            's': '𓃿', 't': '𓄀', 'u': '𓄁', 'v': '𓄂', 'w': '𓄃', 'x': '𓄄', 'y': '𓄅', 'z': '𓄆',
            'A': '𓄇', 'B': '𓄈', 'C': '𓄉', 'D': '𓄊', 'E': '𓄋', 'F': '𓄌', 'G': '𓄍', 'H': '𓄎', 'I': '𓄏',
            'J': '𓄐', 'K': '𓄑', 'L': '𓄒', 'M': '𓄓', 'N': '𓄔', 'O': '𓄕', 'P': '𓄖', 'Q': '𓄗', 'R': '𓄘',
            'S': '𓄙', 'T': '𓄚', 'U': '𓄛', 'V': '𓄜', 'W': '𓄝', 'X': '𓄞', 'Y': '𓄟', 'Z': '𓄠'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        },
        // Detector: Check for Egyptian hieroglyphic characters
        detector: function(text) {
            // Egyptian hieroglyphs - check for presence of any hieroglyphic character
            return /[\u{13000}-\u{1342F}]/u.test(text);
        }

});

// ogham (from symbols/ogham.js)
transforms['ogham'] = new BaseTransformer({

        name: 'Ogham (Celtic)',
    priority: 70,
    category: 'symbols',
        map: {
            'a': 'ᚐ', 'b': 'ᚁ', 'c': 'ᚉ', 'd': 'ᚇ', 'e': 'ᚓ', 'f': 'ᚃ', 'g': 'ᚌ', 'h': 'ᚆ', 'i': 'ᚔ',
            'j': 'ᚈ', 'k': 'ᚊ', 'l': 'ᚂ', 'm': 'ᚋ', 'n': 'ᚅ', 'o': 'ᚑ', 'p': 'ᚚ', 'q': 'ᚊ', 'r': 'ᚏ',
            's': 'ᚄ', 't': 'ᚈ', 'u': 'ᚒ', 'v': 'ᚃ', 'w': 'ᚃ', 'x': 'ᚊ', 'y': 'ᚔ', 'z': 'ᚎ',
            'A': 'ᚐ', 'B': 'ᚁ', 'C': 'ᚉ', 'D': 'ᚇ', 'E': 'ᚓ', 'F': 'ᚃ', 'G': 'ᚌ', 'H': 'ᚆ', 'I': 'ᚔ',
            'J': 'ᚈ', 'K': 'ᚊ', 'L': 'ᚂ', 'M': 'ᚋ', 'N': 'ᚅ', 'O': 'ᚑ', 'P': 'ᚚ', 'Q': 'ᚊ', 'R': 'ᚏ',
            'S': 'ᚄ', 'T': 'ᚈ', 'U': 'ᚒ', 'V': 'ᚃ', 'W': 'ᚃ', 'X': 'ᚊ', 'Y': 'ᚔ', 'Z': 'ᚎ'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        },
        // Detector: Check for Ogham characters
        detector: function(text) {
            // Ogham alphabet (U+1680-U+169C)
            return /[ᚐᚁᚉᚇᚓᚃᚌᚆᚔᚈᚊᚂᚋᚅᚑᚚᚏᚄᚒᚎ]/.test(text);
        }

});

// chemical (from symbols/chemical.js)
transforms['chemical'] = new BaseTransformer({

        name: 'Chemical Symbols',
    priority: 70,
    category: 'symbols',
        map: {
            'a': 'Ac', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'Es', 'f': 'F', 'g': 'Ge', 'h': 'H', 'i': 'I',
            'j': 'J', 'k': 'K', 'l': 'L', 'm': 'Mn', 'n': 'N', 'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R',
            's': 'S', 't': 'Ti', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'Xe', 'y': 'Y', 'z': 'Zn',
            'A': 'AC', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'ES', 'F': 'F', 'G': 'GE', 'H': 'H', 'I': 'I',
            'J': 'J', 'K': 'K', 'L': 'L', 'M': 'MN', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
            'S': 'S', 'T': 'TI', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'XE', 'Y': 'Y', 'Z': 'ZN'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            // Build reverse map using only lowercase keys (since func() lowercases before encoding)
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                // Only use lowercase letter mappings for reverse
                if (key >= 'a' && key <= 'z') {
                    revMap[value] = key;
                }
            }
            
            // Parse the text, trying 2-character symbols first, then 1-character
            let result = '';
            let i = 0;
            while (i < text.length) {
                // Try 2-character symbol first
                if (i + 1 < text.length) {
                    const twoChar = text.substring(i, i + 2);
                    if (revMap[twoChar]) {
                        result += revMap[twoChar];
                        i += 2;
                        continue;
                    }
                }
                
                // Try 1-character symbol
                const oneChar = text[i];
                if (revMap[oneChar]) {
                    result += revMap[oneChar];
                } else {
                    result += oneChar; // Keep non-mapped characters
                }
                i++;
            }
            return result;
        },
        // Detector: Check for chemical element symbols pattern
        detector: function(text) {
            const cleaned = text.trim();
            if (cleaned.length < 3) return false;
            
            // Extract only the letter sequences (ignoring spaces, punctuation, emojis, etc.)
            const letterParts = cleaned.match(/[A-Za-z]+/g);
            if (!letterParts || letterParts.length === 0) return false;
            
            // Check if the letters follow chemical symbol patterns
            const chemicalPattern = /^(Ac|B|C|D|Es|F|Ge|H|I|J|K|L|Mn|N|O|P|Q|R|S|Ti|U|V|W|Xe|Y|Zn|AC|ES|GE|MN|TI|XE|ZN)+$/;
            
            // At least 70% of letter parts should match the chemical pattern
            const matchingParts = letterParts.filter(part => chemicalPattern.test(part));
            return matchingParts.length >= letterParts.length * 0.7;
        }

});

// roman_numerals (from symbols/roman-numerals.js)
transforms['roman_numerals'] = new BaseTransformer({

        name: 'Roman Numerals',
    priority: 70,
    category: 'symbols',
        numerals: [
            ['M',1000],['CM',900],['D',500],['CD',400],
            ['C',100],['XC',90],['L',50],['XL',40],
            ['X',10],['IX',9],['V',5],['IV',4],['I',1]
        ],
        func: function(text) {
            return text.replace(/\b\d+\b/g, m => {
                let num = parseInt(m,10);
                if (num <= 0 || num > 3999 || isNaN(num)) return m;
                let out = '';
                for (const [sym,val] of this.numerals) {
                    while (num >= val) { out += sym; num -= val; }
                }
                return out;
            });
        },
        preview: function(text) {
            return this.func(text || '2024');
        },
        reverse: function(text) {
            // Greedy parse roman numerals to digits
            const map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
            const tokenize = s => s.match(/[IVXLCDM]+|[^IVXLCDM]+/gi) || [s];
            return tokenize(text).map(tok => {
                if (!/^[IVXLCDM]+$/i.test(tok)) return tok;
                const s = tok.toUpperCase();
                let total = 0;
                for (let i=0;i<s.length;i++) {
                    const v = map[s[i]] || 0;
                    const n = map[s[i+1]] || 0;
                    total += v < n ? -v : v;
                }
                return String(total);
            }).join('');
        }

});

// emoji_speak (from symbols/emoji-speak.js)
transforms['emoji_speak'] = new BaseTransformer({

        name: 'Emoji Speak',
    priority: 70,
    category: 'symbols',
        digitMap: {'0':'0️⃣','1':'1️⃣','2':'2️⃣','3':'3️⃣','4':'4️⃣','5':'5️⃣','6':'6️⃣','7':'7️⃣','8':'8️⃣','9':'9️⃣'},
        func: function(text) {
            // Replace digits with keycap emojis
            let out = [...text].map(c => this.digitMap[c] || c).join('');
            
            // Replace words with emojis using keyword lookup
            if (window.emojiData) {
                // Split into words while preserving spaces and punctuation
                const words = out.match(/\b\w+\b/g);
                if (words) {
                    // Process each unique word
                    const processed = new Set();
                    for (const word of words) {
                        const lower = word.toLowerCase();
                        if (processed.has(lower)) continue;
                        processed.add(lower);
                        
                        // Find all emojis that have this word as a keyword
                        const matchingEmojis = [];
                        for (const [emoji, data] of Object.entries(window.emojiData)) {
                            if (typeof data === 'object' && data.keywords && data.keywords.includes(lower)) {
                                matchingEmojis.push(emoji);
                            }
                        }
                        
                        // If we found matches, replace with a random one
                        if (matchingEmojis.length > 0) {
                            const randomEmoji = matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)];
                            const re = new RegExp(`\\b${word}\\b`, 'gi');
                            out = out.replace(re, randomEmoji);
                        }
                    }
                }
                
                // Second pass: Replace single characters and symbols (?, !, <3, arrows, etc.)
                // Build a map of all single-char/symbol keywords
                const symbolMap = new Map();
                for (const [emoji, data] of Object.entries(window.emojiData)) {
                    if (typeof data === 'object' && data.keywords) {
                        for (const keyword of data.keywords) {
                            // Only consider symbols (non-word characters or very short patterns)
                            // Exclude single digits since they're already handled by digitMap
                            if (keyword.length <= 3 && !/^\w+$/.test(keyword) && !/^\d$/.test(keyword)) {
                                if (!symbolMap.has(keyword)) {
                                    symbolMap.set(keyword, []);
                                }
                                symbolMap.get(keyword).push(emoji);
                            }
                        }
                    }
                }
                
                // Replace symbols (longest first to handle multi-char like <3 before <)
                const sortedSymbols = Array.from(symbolMap.keys()).sort((a, b) => b.length - a.length);
                for (const symbol of sortedSymbols) {
                    if (out.includes(symbol)) {
                        const matchingEmojis = symbolMap.get(symbol);
                        const randomEmoji = matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)];
                        // Escape special regex characters
                        const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        out = out.replace(new RegExp(escaped, 'g'), randomEmoji);
                    }
                }
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '1️⃣2️⃣3️⃣ ✅';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }
        // No reverse function - emoji speak is not meant to be decoded

});

// regional_indicator (from symbols/regional-indicator.js)
transforms['regional_indicator'] = new BaseTransformer({

        name: 'Regional Indicator Letters',
    priority: 70,
    category: 'symbols',
        func: function(text) {
            const base = 0x1F1E6;
            return [...text].map(c => {
                const up = c.toUpperCase();
                if (up >= 'A' && up <= 'Z') {
                    const code = base + (up.charCodeAt(0) - 65);
                    return String.fromCodePoint(code);
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            if (!text) return '🇦🇧🇨';
            return this.func(text.slice(0, 4)) + (text.length > 4 ? '...' : '');
        },
        reverse: function(text) {
            const base = 0x1F1E6;
            return [...text].map(ch => {
                const cp = ch.codePointAt(0);
                if (cp >= base && cp <= base + 25) {
                    return String.fromCharCode(65 + (cp - base));
                }
                return ch;
            }).join('');
        }

});

// invisible_text (from special/invisible-text.js)
transforms['invisible_text'] = new BaseTransformer({

        name: 'Invisible Text',
    priority: 1, // Lowest priority - last resort due to high false positive risk
    category: 'special',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            return Array.from(bytes)
                .map(byte => String.fromCodePoint(0xE0000 + byte))
                .join('');
        },
        preview: function(text) {
            return '[invisible]';
        },
        reverse: function(text) {
            if (!text) return '';
            const matches = [...text.matchAll(/[\u{E0000}-\u{E00FF}]/gu)];
            if (!matches.length) return '';
            
            // Convert invisible characters back to bytes
            const bytes = new Uint8Array(
                matches.map(match => match[0].codePointAt(0) - 0xE0000)
            );
            
            // Use TextDecoder to properly handle UTF-8 encoded bytes (including emoji)
            return new TextDecoder().decode(bytes);
        },
        // Detector: Check for invisible Unicode characters with ratio threshold
        detector: function(text) {
            // Invisible text uses Unicode Private Use Area (U+E0000-U+E00FF for full byte range)
            const invisibleMatches = text.match(/[\u{E0000}-\u{E00FF}]/gu);
            if (!invisibleMatches || invisibleMatches.length === 0) return false;
            
            // Count code points instead of JS string length (supplementary chars = 2 string units)
            const codePointCount = [...text].length;
            const invisibleRatio = invisibleMatches.length / codePointCount;
            
            // Only decode as invisible text if at least 50% of code points are invisible
            // This prevents false positives when invisible chars are mixed with other content
            return invisibleRatio >= 0.5;
        }

});

// brainfuck (from special/brainfuck.js)
transforms['brainfuck'] = new BaseTransformer({
    name: 'Brainfuck',
    priority: 300,
    category: 'special',
    
    // Detector: Only Brainfuck commands (8 characters)
    detector: function(text) {
        const cleaned = text.trim();
        return cleaned.length >= 10 && /^[><+\-.,\[\]\s]+$/.test(cleaned);
    },
    
    // Simple character to Brainfuck encoding
    encode: function(char) {
            const code = char.charCodeAt(0);
            return '+'.repeat(code) + '.';
        },
        func: function(text) {
            // Convert each character to Brainfuck
            // Use >[-] to move to next cell and clear it (stay on the new cell)
            return [...text].map(c => this.encode(c)).join('>[-]');
        },
        preview: function(text) {
            return '[brainfuck]';
        },
        // Brainfuck interpreter for decoding
        reverse: function(code) {
            const cells = new Array(30000).fill(0);
            let pointer = 0;
            let output = '';
            let codePointer = 0;
            let iterations = 0;
            const maxIterations = 100000; // Prevent infinite loops
            
            while (codePointer < code.length && iterations < maxIterations) {
                iterations++;
                const instruction = code[codePointer];
                
                switch (instruction) {
                    case '>':
                        pointer++;
                        if (pointer >= cells.length) pointer = 0;
                        break;
                    case '<':
                        pointer--;
                        if (pointer < 0) pointer = cells.length - 1;
                        break;
                    case '+':
                        cells[pointer] = (cells[pointer] + 1) % 256;
                        break;
                    case '-':
                        cells[pointer] = (cells[pointer] - 1 + 256) % 256;
                        break;
                    case '.':
                        output += String.fromCharCode(cells[pointer]);
                        break;
                    case '[':
                        if (cells[pointer] === 0) {
                            let depth = 1;
                            while (depth > 0) {
                                codePointer++;
                                if (code[codePointer] === '[') depth++;
                                if (code[codePointer] === ']') depth--;
                            }
                        }
                        break;
                    case ']':
                        if (cells[pointer] !== 0) {
                            let depth = 1;
                            while (depth > 0) {
                                codePointer--;
                                if (code[codePointer] === ']') depth++;
                                if (code[codePointer] === '[') depth--;
                            }
                        }
                        break;
                    case ',':
                        // Input not supported in web context
                        cells[pointer] = 0;
                        break;
                }
                codePointer++;
            }
            
            return output || null;
        }

});

// randomizer (from special/randomizer.js)
transforms['randomizer'] = new BaseTransformer({

        name: 'Random Mix',
    priority: 20,
    category: 'special',
        
        // Get a list of transforms suitable for randomization
        getRandomizableTransforms() {
            const suitable = [
                'base64', 'binary', 'hex', 'morse', 'rot13', 'caesar', 'atbash', 'rot5',
                'upside_down', 'bubble', 'small_caps', 'fullwidth', 'leetspeak', 'superscript', 'subscript',
                'quenya', 'tengwar', 'klingon', 'dovahzul', 'elder_futhark',
                'hieroglyphics', 'ogham', 'mathematical', 'cursive', 'medieval',
                'monospace', 'greek', 'braille', 'alternating_case', 'reverse_words',
                'title_case', 'sentence_case', 'camel_case', 'snake_case', 'kebab_case', 'random_case',
                'regional_indicator', 'fraktur', 'cyrillic_stylized', 'katakana', 'hiragana', 'emoji_speak',
                'base58', 'base62', 'roman_numerals', 'vigenere', 'rail_fence', 'base64url'
            ];
            return suitable.filter(name => window.transforms[name]);
        },
        
        // Apply random transforms to each word in a sentence
        func: function(text, options = {}) {
            if (!text) return '';
            
            const {
                preservePunctuation = true,
                minTransforms = 2,
                maxTransforms = 5,
                allowRepeats = false
            } = options;
            
            // Split text into words while preserving punctuation
            const words = this.smartWordSplit(text);
            const availableTransforms = this.getRandomizableTransforms();
            
            if (availableTransforms.length === 0) return text;
            
            // Select random transforms to use
            const numTransforms = Math.min(
                Math.max(minTransforms, Math.floor(Math.random() * maxTransforms) + 1),
                availableTransforms.length
            );
            
            const selectedTransforms = [];
            const usedTransforms = new Set();
            
            for (let i = 0; i < numTransforms; i++) {
                let transform;
                do {
                    transform = availableTransforms[Math.floor(Math.random() * availableTransforms.length)];
                } while (!allowRepeats && usedTransforms.has(transform) && usedTransforms.size < availableTransforms.length);
                
                selectedTransforms.push(transform);
                usedTransforms.add(transform);
            }
            
            // Apply random transforms to words
            const transformedWords = words.map(wordObj => {
                if (wordObj.isWord) {
                    const randomTransform = selectedTransforms[Math.floor(Math.random() * selectedTransforms.length)];
                    const transform = window.transforms[randomTransform];
                    
                    try {
                        const transformed = transform.func(wordObj.text);
                        return {
                            ...wordObj,
                            text: transformed,
                            transform: transform.name,
                            originalTransform: randomTransform
                        };
                    } catch (e) {
                        console.error(`Error applying ${randomTransform} to "${wordObj.text}":`, e);
                        return wordObj;
                    }
                } else {
                    return wordObj; // Keep punctuation/spaces as-is
                }
            });
            
            // Reconstruct the text
            const result = transformedWords.map(w => w.text).join('');
            
            // Store transform mapping for decoding
            this.lastTransformMap = transformedWords
                .filter(w => w.isWord && w.originalTransform)
                .map(w => ({
                    original: w.text,
                    transform: w.originalTransform,
                    transformName: w.transform
                }));
            
            return result;
        },
        
        // Smart word splitting that preserves punctuation
        smartWordSplit: function(text) {
            const words = [];
            let currentWord = '';
            let isInWord = false;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const isWordChar = /[a-zA-Z0-9]/.test(char);
                
                if (isWordChar) {
                    if (!isInWord && currentWord) {
                        // We were in punctuation/space, now starting a word
                        words.push({ text: currentWord, isWord: false });
                        currentWord = '';
                    }
                    currentWord += char;
                    isInWord = true;
                } else {
                    if (isInWord && currentWord) {
                        // We were in a word, now in punctuation/space
                        words.push({ text: currentWord, isWord: true });
                        currentWord = '';
                    }
                    currentWord += char;
                    isInWord = false;
                }
            }
            
            // Add the last segment
            if (currentWord) {
                words.push({ text: currentWord, isWord: isInWord });
            }
            
            return words;
        },
        
        preview: function(text) {
            return '[mixed transforms]';
        },
        
        // Note: No reverse function - this transform is non-reversible
        // because different random transforms are applied to different words
        
        // Get info about the last randomization
        getLastTransformInfo: function() {
            return this.lastTransformMap || [];
        }

});


// Expose to window
window.transforms = transforms;
window.encoders = transforms; // Alias for compatibility

})();
