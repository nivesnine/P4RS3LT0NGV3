// Text transformation functions
const transforms = {
    // Invisible Text transform
    invisible_text: {
        name: 'Invisible Text',
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
            const bytesArr = [];
            for (const ch of Array.from(text)) {
                const cp = ch.codePointAt(0);
                if (cp >= 0xE0000 && cp <= 0xE007F) bytesArr.push(cp - 0xE0000);
            }
            if (!bytesArr.length) return '';
            const bytes = new Uint8Array(bytesArr);
            try {
                return new TextDecoder().decode(bytes);
            } catch (_) {
                // Fallback: direct char mapping
                return Array.from(bytesArr).map(b => String.fromCharCode(b)).join('');
            }
        }
    },

    // Basic transforms
    upside_down: {
        name: 'Upside Down',
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
        preview: function(text) { return this.func(text || 'abc'); },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return [...text].map(c => revMap[c] || c).reverse().join('');
        }
    },

    elder_futhark: {
        name: 'Elder Futhark',
        map: {
            'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᛲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
            'j': 'ᛃ', 'k': 'ᛲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛲᛩ', 'r': 'ᚱ',
            's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᛩ', 'w': 'ᛩ', 'x': 'ᛲᛋ', 'y': 'ᛁ', 'z': 'ᛉ'
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
        preview: function(text) { return this.func(text || 'runes'); },
        reverse: function(text) {
            const revMap = this.reverseMap();
            return [...text].map(c => revMap[c] || c).join('');
        }
    },

    vaporwave: {
        name: 'Vaporwave',
        func: function(text) {
            return [...text].join(' ');
        },
        preview: function(text) {
            if (!text) return '[base64]';
            return btoa(text.slice(0, 3)) + '...';
        }
    },

    zalgo: {
        name: 'Zalgo',
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
        }
    },

    small_caps: {
        name: 'Small Caps',
        map: {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
            'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
            's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            return this.func(text);
        }
    },

    braille: {
        name: 'Braille',
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
        preview: function(text) {
            return this.func(text);
        }
    },

    bubble: {
        name: 'Bubble',
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
        preview: function(text) {
            return this.func(text);
        }
    },

    morse: {
        name: 'Morse Code',
        map: {
            'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
            'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
            'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
            's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
            'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.'
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
                return text.split(/\s+/).map(c => revMap[c] || c).join('');
            } else {
                // Encode mode
                return [...text.toLowerCase()].map(c => this.map[c] || c).join(' ');
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
    },

    binary: {
        name: 'Binary',
        func: function(text) {
            const bytes = new TextEncoder().encode(text || '');
            return Array.from(bytes).map(b => b.toString(2).padStart(8,'0')).join(' ');
        },
        preview: function(text) {
            return this.func(text || 'abc');
        },
        reverse: function(text) {
            const binText = (text || '').replace(/\s+/g, '');
            const bytes = [];
            for (let i=0;i<binText.length;i+=8) {
                const byte = binText.substr(i,8);
                if (byte.length===8) bytes.push(parseInt(byte,2));
            }
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }
    },

    // Note: other transforms don't have reverse functions because they're not easily reversible
    // The universal decoder will only try to reverse transforms that have a reverse function
    
    // Additional transforms
    base64: {
        name: 'Base64',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let bin = '';
            for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
            return btoa(bin);
        },
        preview: function(text) {
            if (!text) return '[base64]';
            return btoa(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            try {
                if (!text) return '';
                const bin = atob(text);
                const bytes = new Uint8Array(bin.length);
                for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
                return new TextDecoder().decode(bytes);
            } catch (e) {
                return text;
            }
        }
    },
    
    base64url: {
        name: 'Base64 URL',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let bin = '';
            for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
            const std = btoa(bin);
            return std.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
        },
        preview: function(text) {
            if (!text) return '[b64url]';
            return this.func(text.slice(0,3)) + '...';
        },
        reverse: function(text) {
            if (!text) return '';
            let std = text.replace(/-/g, '+').replace(/_/g, '/');
            while (std.length % 4 !== 0) std += '=';
            try { 
                const bin = atob(std);
                const bytes = new Uint8Array(bin.length);
                for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
                return new TextDecoder().decode(bytes);
            } catch (e) { return text; }
        }
    },
    
    hex: {
        name: 'Hexadecimal',
        func: function(text) {
            return [...text].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        },
        preview: function(text) {
            if (!text) return '[hex]';
            const firstChar = text.charAt(0);
            return firstChar.charCodeAt(0).toString(16).padStart(2, '0') + '...';
        },
        reverse: function(text) {
            const hexText = text.replace(/\s+/g, '');
            let result = '';
            
            for (let i = 0; i < hexText.length; i += 2) {
                const byte = hexText.substr(i, 2);
                if (byte.length === 2) {
                    result += String.fromCharCode(parseInt(byte, 16));
                }
            }
            return result;
        }
    },
    // Hex (compact uppercase)
    hex_compact: {
        name: 'Hex (Compact Uppercase)',
        func: function(text) {
            const bytes = new TextEncoder().encode(text || '');
            return Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2,'0')).join('');
        },
        preview: function(text) { return this.func(text || 'Hi'); },
        reverse: function(text) {
            const s = (text || '').replace(/\s+/g,'');
            const out = [];
            for (let i=0;i<s.length;i+=2) {
                const byte = s.substr(i,2); if (byte.length===2) out.push(parseInt(byte,16));
            }
            return new TextDecoder().decode(Uint8Array.from(out));
        }
    },
    
    caesar: {
        name: 'Caesar Cipher',
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
        }
    },
    
    rot13: {
        name: 'ROT13',
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
            if (!text) return '[monospace]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // ROT13 is its own inverse
            return this.func(text);
        }
    },
    
    leetspeak: {
        name: 'Leetspeak',
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
        }
    },
    
    mirror: {
        name: 'Mirror Text',
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
    },
    
    nato: {
        name: 'NATO Phonetic',
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
            return [...text.toLowerCase()].map(c => this.map[c] || c).join(' ');
        },
        preview: function(text) {
            if (!text) return '[quenya]';
            return this.func(text.slice(0, 3)) + '...';
        },
        }
    },
    
    fullwidth: {
        name: 'Full Width',
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
    },
    
    strikethrough: {
        name: 'Strikethrough',
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
    },
    
    underline: {
        name: 'Underline',
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
    },
    
    medieval: {
        name: 'Medieval',
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
        preview: function(text) {
            return this.func(text);
        }
    },
    
    cursive: {
        name: 'Cursive',
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
        preview: function(text) {
            return this.func(text);
        }
    },
    
    monospace: {
        name: 'Monospace',
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
        preview: function(text) {
            return this.func(text);
        }
    },
    
    doubleStruck: {
        name: 'Double-Struck',
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
        preview: function(text) {
            return this.func(text);
        }
    },
    
    ascii85: {
        name: 'ASCII85',
        func: function(text) {
            // Simple ASCII85 encoding implementation
            let result = '<~';
            let buffer = 0;
            let bufferLength = 0;
            
            for (let i = 0; i < text.length; i++) {
                buffer = (buffer << 8) | text.charCodeAt(i);
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
            if (!text) return '[runes]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // Check if it's a valid ASCII85 string
            if (!text.startsWith('<~') || !text.endsWith('~>')) {
                return text;
            }
            
            // Remove delimiters and whitespace
            text = text.substring(2, text.length - 2).replace(/\s+/g, '');
            
            let result = '';
            let i = 0;
            
            while (i < text.length) {
                // Handle 'z' special case (represents 4 zero bytes)
                if (text[i] === 'z') {
                    result += '\0\0\0\0';
                    i++;
                    continue;
                }
                
                // Process a group of 5 characters
                if (i + 5 <= text.length || i + 1 <= text.length) {
                    let value = 0;
                    const limit = Math.min(i + 5, text.length);
                    
                    // Convert the group to a 32-bit value
                    for (let j = i; j < limit; j++) {
                        value = value * 85 + (text.charCodeAt(j) - 33);
                    }
                    
                    // Pad with 'u' (84) if needed
                    for (let j = limit; j < i + 5; j++) {
                        value = value * 85 + 84;
                    }
                    
                    // Extract bytes from the value
                    const bytesToWrite = limit - i - 1;
                    for (let j = 3; j >= 4 - bytesToWrite; j--) {
                        result += String.fromCharCode((value >>> (j * 8)) & 0xFF);
                    }
                    
                    i = limit;
                } else {
                    break;
                }
            }
            
            return result;
        }
    },
    
    reverse: {
        name: 'Reverse Text',
        func: function(text) {
            return [...text].reverse().join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            return this.func(text); // Reversing is its own inverse
        }
    },
    
    url: {
        name: 'URL Encode',
        func: function(text) {
            return encodeURIComponent(text);
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
    },
    
    html: {
        name: 'HTML Entities',
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
    },
    
    pigLatin: {
        name: 'Pig Latin',
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
                
                // Check if the word ends with 'way' (vowel case)
                if (word.endsWith('way')) {
                    return word.slice(0, -3);
                }
                
                // Check if the word ends with 'ay' (consonant case)
                if (word.endsWith('ay')) {
                    // Extract the part before 'ay'
                    const base = word.slice(0, -2);
                    
                    // Find the last consonant cluster
                    // In Pig Latin, the original first consonant cluster is moved to the end
                    // So we need to move it back to the beginning
                    for (let i = 1; i <= base.length; i++) {
                        const possibleCluster = base.slice(-i);
                        const possibleResult = possibleCluster + base.slice(0, -i);
                        
                        // If this looks like a valid word, return it
                        // This is a simple heuristic and might not work for all cases
                        if (/^[bcdfghjklmnpqrstvwxyz]/i.test(possibleResult)) {
                            return possibleResult;
                        }
                    }
                }
                
                return word;
            }).join(' ');
        }
    },
    
    rainbow: {
        name: 'Rainbow Text',
        colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
        func: function(text) {
            // This is just a preview function that returns a description
            // The actual rainbow effect is applied in the UI
            return text;
        },
        preview: function(text) {
            return text;
        }
    },
    
    rot47: {
        name: 'ROT47',
        func: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                // ROT47 operates on a character set from ASCII 33 to ASCII 126
                if (code >= 33 && code <= 126) {
                    return String.fromCharCode(33 + ((code - 33 + 14) % 94));
                }
                return c;
            }).join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            return [...text].map(c => {
                const code = c.charCodeAt(0);
                if (code >= 33 && code <= 126) {
                    return String.fromCharCode(33 + ((code - 33 + 94 - 14) % 94));
                }
                return c;
            }).join('');
        }
    },
    
    base32: {
        name: 'Base32',
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
            const result = this.func(text.slice(0, 2));
            return result + '...';
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
            
            let result = '';
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i].toUpperCase();
                if (revMap[char] === undefined) continue; // Skip invalid characters
                
                value = (value << 5) | revMap[char];
                bits += 5;
                
                while (bits >= 8) {
                    bits -= 8;
                    result += String.fromCharCode((value >> bits) & 0xFF);
                }
            }
            
            return result;
        }
    },
    
    // Base32 Crockford (no padding, normalized decode)
    base32_crockford: {
        name: 'Base32 Crockford',
        alphabet: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let result = '';
            let bits = 0, value = 0;
            for (let i=0;i<bytes.length;i++) {
                value = (value << 8) | bytes[i]; bits += 8;
                while (bits >= 5) { bits -= 5; result += this.alphabet[(value >> bits) & 0x1F]; }
            }
            if (bits > 0) result += this.alphabet[(value << (5 - bits)) & 0x1F];
            return result;
        },
        preview: function(text) { return this.func(text || 'hi'); },
        reverse: function(text) {
            if (!text) return '';
            const norm = String(text).toUpperCase().replace(/[IL]/g,'1').replace(/[O]/g,'0').replace(/[-_\s]/g,'');
            const map = {};
            for (let i=0;i<this.alphabet.length;i++) map[this.alphabet[i]] = i;
            let result = '';
            let bits = 0, value = 0;
            for (let i=0;i<norm.length;i++) {
                const v = map[norm[i]]; if (v === undefined) continue;
                value = (value << 5) | v; bits += 5;
                while (bits >= 8) { bits -= 8; result += String.fromCharCode((value >> bits) & 0xFF); }
            }
            return result;
        }
    },

    greek: {
        name: 'Greek Letters',
        map: {
            'a': 'α', 'b': 'β', 'c': 'χ', 'd': 'δ', 'e': 'ε', 'f': 'φ', 'g': 'γ', 'h': 'η',
            'i': 'ι', 'j': 'ξ', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ο', 'p': 'π',
            'q': 'θ', 'r': 'ρ', 's': 'σ', 't': 'τ', 'u': 'υ', 'v': 'ς', 'w': 'ω', 'x': 'χ',
            'y': 'ψ', 'z': 'ζ',
            'A': 'Α', 'B': 'Β', 'C': 'Χ', 'D': 'Δ', 'E': 'Ε', 'F': 'Φ', 'G': 'Γ', 'H': 'Η',
            'I': 'Ι', 'J': 'Ξ', 'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Π',
            'Q': 'Θ', 'R': 'Ρ', 'S': 'Σ', 'T': 'Τ', 'U': 'Υ', 'V': 'ς', 'W': 'Ω', 'X': 'Χ',
            'Y': 'Ψ', 'Z': 'Ζ'
        },
        func: function(text) {
            return text.split('').map(char => this.map[char] || char).join('');
        },
        preview: function(text) {
            return text.substring(0, 10) + (text.length > 10 ? '...' : '');
        },
        reverse: undefined
    },
    
    wingdings: {
        name: 'Wingdings',
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
            return text.substring(0, 10) + (text.length > 10 ? '...' : '');
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
    },
    
    // Fantasy and Fictional Languages
    
    quenya: {
        name: 'Quenya (Tolkien Elvish)',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            // Create reverse map
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    tengwar: {
        name: 'Tengwar Script',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    klingon: {
        name: 'Klingon',
        map: {
            'a': 'a', 'b': 'b', 'c': 'ch', 'd': 'D', 'e': 'e', 'f': 'f', 'g': 'gh', 'h': 'H', 'i': 'I',
            'j': 'j', 'k': 'q', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'Q', 'r': 'r',
            's': 'S', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
            'A': 'A', 'B': 'B', 'C': 'CH', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'GH', 'H': 'H', 'I': 'I',
            'J': 'J', 'K': 'Q', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    aurebesh: {
        name: 'Aurebesh (Star Wars)',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value.toLowerCase()] = key;
            }
            return text.split(/\s+/).map(word => revMap[word.toLowerCase()] || word).join('');
        }
    },
    
    dovahzul: {
        name: 'Dovahzul (Dragon)',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    hieroglyphics: {
        name: 'Hieroglyphics',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    ogham: {
        name: 'Ogham (Celtic)',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    semaphore: {
        name: 'Semaphore Flags',
        map: {
            'a': '🔄', 'b': '🔄', 'c': '🔄', 'd': '🔄', 'e': '🔄', 'f': '🔄', 'g': '🔄', 'h': '🔄', 'i': '🔄',
            'j': '🔄', 'k': '🔄', 'l': '🔄', 'm': '🔄', 'n': '🔄', 'o': '🔄', 'p': '🔄', 'q': '🔄', 'r': '🔄',
            's': '🔄', 't': '🔄', 'u': '🔄', 'v': '🔄', 'w': '🔄', 'x': '🔄', 'y': '🔄', 'z': '🔄'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join(' ');
        },
        preview: function(text) {
            return this.func(text);
        }
    },
    
    brainfuck: {
        name: 'Brainfuck',
        map: {
            'a': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'b': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'c': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'd': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'e': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'f': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'g': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'h': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'i': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'j': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'k': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'l': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'm': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'n': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'o': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'p': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'q': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'r': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            's': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            't': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'u': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'v': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'w': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'x': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'y': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
            'z': '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            return '[brainfuck]';
        }
    },
    
    mathematical: {
        name: 'Mathematical Notation',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },
    
    chemical: {
        name: 'Chemical Symbols',
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
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return [...text].map(c => revMap[c] || c).join('');
        }
    },

    // Base58 (Bitcoin alphabet)
    base58: {
        name: 'Base58',
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
            return this.func(text.slice(0, 3)) + '...';
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
    },

    // Base62 (0-9A-Za-z)
    base62: {
        name: 'Base62',
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
    },

    // Bitflip (NOT) + Base64
    bitflip_b64: {
        name: 'Bitflip (NOT)+Base64',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            const flipped = new Uint8Array(bytes.length);
            for (let i=0;i<bytes.length;i++) flipped[i] = bytes[i] ^ 0xFF;
            let bin = ''; for (let i=0;i<flipped.length;i++) bin += String.fromCharCode(flipped[i]);
            return btoa(bin);
        },
        preview: function(text) { return this.func(text || 'flip'); },
        reverse: function(text) {
            try {
                const bin = atob(text || '');
                const bytes = new Uint8Array(bin.length);
                for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i) ^ 0xFF;
                return new TextDecoder().decode(bytes);
            } catch (e) { return text; }
        }
    },
    // Base85 (Z85 variant)
    base85_z85: {
        name: 'Base85 (Z85)',
        alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            if (bytes.length % 4 !== 0) {
                // Z85 requires length %4==0; pad with zeros and strip later marker
                const padded = new Uint8Array(bytes.length + (4 - (bytes.length % 4)));
                padded.set(bytes);
                return this._encodeZ85(padded).replace(/~+$/,'');
            }
            return this._encodeZ85(bytes);
        },
        _encodeZ85: function(bytes) {
            const enc = this.alphabet;
            let out = '';
            for (let i = 0; i < bytes.length; i += 4) {
                const value = (bytes[i] << 24) >>> 0 | (bytes[i+1] << 16) | (bytes[i+2] << 8) | (bytes[i+3]);
                let div = value >>> 0;
                const block = new Array(5);
                for (let j = 4; j >= 0; j--) { block[j] = enc[div % 85]; div = Math.floor(div / 85); }
                out += block.join('');
            }
            return out;
        },
        preview: function(text) {
            return this.func(text || 'hello');
        },
        reverse: function(text) {
            if (!text) return '';
            const enc = this.alphabet;
            const map = {};
            for (let i=0;i<enc.length;i++) map[enc[i]] = i;
            const str = String(text);
            if (str.length % 5 !== 0) {
                // pad with leading of last block to make divisible
                const pad = 5 - (str.length % 5);
                // use the first alphabet char as zero padding
                return this._decodeZ85(str + enc[0].repeat(pad));
            }
            return this._decodeZ85(str);
        },
        _decodeZ85: function(str) {
            const enc = this.alphabet;
            const map = {};
            for (let i=0;i<enc.length;i++) map[enc[i]] = i;
            const bytes = [];
            for (let i = 0; i < str.length; i += 5) {
                let value = 0;
                for (let j = 0; j < 5; j++) { value = value * 85 + (map[str[i+j]] || 0); }
                bytes.push((value >>> 24) & 0xFF, (value >>> 16) & 0xFF, (value >>> 8) & 0xFF, value & 0xFF);
            }
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }
    },

    // Base91 (Joachim Henke)
    base91: {
        name: 'Base91',
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"",
        func: function(text) {
            if (!text) return '';
            const enc = this.alphabet;
            const bytes = new TextEncoder().encode(text);
            let b = 0, n = 0, out = '';
            for (let i = 0; i < bytes.length; i++) {
                b |= bytes[i] << n; n += 8;
                if (n > 13) {
                    let v = b & 8191; // 2^13-1
                    if (v > 88) { b >>= 13; n -= 13; }
                    else { v = b & 16383; b >>= 14; n -= 14; }
                    out += enc[v % 91] + enc[Math.floor(v / 91)];
                }
            }
            if (n) out += enc[b % 91] + (n > 7 ? enc[Math.floor(b / 91)] : '');
            return out;
        },
        preview: function(text) { return this.func(text || 'base91'); },
        reverse: function(text) {
            if (!text) return '';
            const enc = this.alphabet;
            const map = {}; for (let i=0;i<enc.length;i++) map[enc[i]] = i;
            let b = 0, n = 0, v = -1; const out = [];
            for (let i = 0; i < text.length; i++) {
                const c = map[text[i]]; if (c === undefined) continue;
                if (v < 0) v = c; else {
                    v += c * 91; b |= v << n; n += (v & 8191) > 88 ? 13 : 14; v = -1;
                    while (n >= 8) { out.push(b & 255); b >>= 8; n -= 8; }
                }
            }
            if (v > -1) out.push((b | (v << n)) & 255);
            return new TextDecoder().decode(Uint8Array.from(out));
        }
    },

    // Quoted-Printable
    quoted_printable: {
        name: 'Quoted-Printable',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let out = '';
            for (let i=0;i<bytes.length;i++) {
                const b = bytes[i];
                const ch = String.fromCharCode(b);
                const isPrintable = (b >= 33 && b <= 126 && ch !== '=');
                if (isPrintable) out += ch; else out += '=' + b.toString(16).toUpperCase().padStart(2,'0');
            }
            // Soft-wrap at 76 chars
            return out.replace(/.{1,76}/g, (m)=>m + (m.length===76?'=\r\n':'')).replace(/=\r\n$/,'');
        },
        preview: function(text) { return this.func(text || 'Café'); },
        reverse: function(text) {
            if (!text) return '';
            const str = text.replace(/=\r?\n/g,'');
            const bytes = [];
            for (let i=0;i<str.length;i++) {
                if (str[i] === '=' && /[0-9A-Fa-f]{2}/.test(str.slice(i+1,i+3))) {
                    bytes.push(parseInt(str.slice(i+1,i+3),16)); i += 2;
                } else {
                    bytes.push(str.charCodeAt(i));
                }
            }
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }
    },

    // Base45 (RFC 9285, used in QR payloads)
    base45: {
        name: 'Base45',
        alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',
        func: function(text) {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            let out = '';
            for (let i = 0; i < bytes.length; i += 2) {
                if (i + 1 < bytes.length) {
                    const x = bytes[i];
                    const y = bytes[i + 1];
                    const v = x * 256 + y;
                    const e = v % 45; const d = Math.floor(v / 45) % 45; const c = Math.floor(v / (45 * 45));
                    out += this.alphabet[c] + this.alphabet[d] + this.alphabet[e];
                } else {
                    const x = bytes[i];
                    const d = Math.floor(x / 45); const e = x % 45;
                    out += this.alphabet[d] + this.alphabet[e];
                }
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '[base45]';
            return this.func(text.slice(0,3)) + '...';
        },
        reverse: function(text) {
            if (!text) return '';
            const idx = c => this.alphabet.indexOf(c);
            const bytes = [];
            let i = 0;
            while (i < text.length) {
                if (i + 2 < text.length) {
                    const c = idx(text[i++]); const d = idx(text[i++]); const e = idx(text[i++]);
                    if (c < 0 || d < 0 || e < 0) continue;
                    const v = c * 45 * 45 + d * 45 + e;
                    bytes.push(Math.floor(v / 256), v % 256);
                } else if (i + 1 < text.length) {
                    const d = idx(text[i++]); const e = idx(text[i++]);
                    if (d < 0 || e < 0) continue;
                    const v = d * 45 + e;
                    bytes.push(v);
                } else {
                    break;
                }
            }
            return new TextDecoder().decode(Uint8Array.from(bytes));
        }
    },

    // Roman Numerals (1..3999)
    roman_numerals: {
        name: 'Roman Numerals',
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
    },

    // Rail Fence Cipher (5 rails)
    rail_fence_5: {
        name: 'Rail Fence (5 Rails)',
        rails: 5,
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
            if (!text) return '[rail5]';
            return this.func(text.slice(0,12)) + (text.length>12?'...':'');
        },
        reverse: function(text) {
            const len = text.length;
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
                railsArr[r] = text.slice(idx, idx+counts[r]).split('');
                idx += counts[r];
            }
            const positions = Array(this.rails).fill(0);
            let out = '';
            for (const r of pattern) {
                out += railsArr[r][positions[r]++];
            }
            return out;
        }
    },

    // Vigenère Cipher (default key: KEY)
    vigenere: {
        name: 'Vigenère Cipher',
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
    },

    // XOR Cipher with default key (outputs Base64)
    xor_cipher: {
        name: 'XOR Cipher (KEY)',
        key: 'KEY',
        func: function(text) {
            const encoder = new TextEncoder();
            const keyBytes = encoder.encode(this.key);
            const bytes = encoder.encode(text);
            const out = new Uint8Array(bytes.length);
            for (let i=0;i<bytes.length;i++) out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
            // base64 encode
            let bin = '';
            for (let i=0;i<out.length;i++) bin += String.fromCharCode(out[i]);
            return btoa(bin);
        },
        preview: function(text) {
            if (!text) return '[xor]';
            return this.func(text.slice(0,8)) + '...';
        },
        reverse: function(text) {
            try {
                const bin = atob(text);
                const enc = new TextEncoder();
                const keyBytes = enc.encode(this.key);
                const data = new Uint8Array(bin.length);
                for (let i=0;i<bin.length;i++) data[i] = bin.charCodeAt(i);
                for (let i=0;i<data.length;i++) data[i] ^= keyBytes[i % keyBytes.length];
                return new TextDecoder().decode(data);
            } catch (e) { return text; }
        }
    },

    // Rail Fence Cipher (3 rails)
    rail_fence: {
        name: 'Rail Fence (3 Rails)',
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
            const len = text.length;
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
                railsArr[r] = text.slice(idx, idx+counts[r]).split('');
                idx += counts[r];
            }
            const positions = Array(this.rails).fill(0);
            let out = '';
            for (const r of pattern) {
                out += railsArr[r][positions[r]++];
            }
            return out;
        }
    },

    // ROT18 (ROT13 letters + ROT5 digits)
    rot18: {
        name: 'ROT18',
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
    },

    // Swap Case
    swap_case: {
        name: 'Swap Case',
        func: function(text) {
            return [...text].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        },
        preview: function(text) {
            if (!text) return '[sWaP]';
            return this.func(text.slice(0,8)) + (text.length>8?'...':'');
        },
        reverse: function(text) { return this.func(text); }
    },

    // A1Z26 (letters to 1-26, separated by hyphens)
    a1z26: {
        name: 'A1Z26',
        func: function(text) {
            return text.replace(/[A-Za-z]/g, c => {
                const n = (c.toUpperCase().charCodeAt(0) - 64);
                return String(n) + '-';
            }).replace(/-+(?!\d)/g,'-').replace(/-+$/,'');
        },
        preview: function(text) {
            if (!text) return '[1-26]';
            return this.func(text.slice(0, 5)) + '...';
        },
        reverse: undefined
    },

    // Affine Cipher (a=5, b=8)
    affine: {
        name: 'Affine Cipher (a=5,b=8)',
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
    },

    // QWERTY Right-Shift (maps to next key on same row)
    qwerty_shift: {
        name: 'QWERTY Right Shift',
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
    },
    // QWERTY Left-Shift (maps to previous key on same row)
    qwerty_left_shift: {
        name: 'QWERTY Left Shift',
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
                    const from = row[i], to = row[(i-1+row.length)%row.length];
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
            if (!text) return '[qwerty←]';
            return this.func(text.slice(0,8)) + (text.length>8?'...':'');
        },
        reverse: function(text) {
            const m = this.buildMap();
            const inv = {}; Object.keys(m).forEach(k => inv[m[k]] = k);
            return [...text].map(c => inv[c] || c).join('');
        }
    },

    // Case/formatting transforms
    title_case: {
        name: 'Title Case',
        func: function(text) {
            return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        },
        preview: function(text) {
            if (!text) return '[Title Case]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }
    },

    sentence_case: {
        name: 'Sentence Case',
        func: function(text) {
            if (!text) return '';
            const lower = text.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        },
        preview: function(text) {
            if (!text) return '[Sentence]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }
    },

    camel_case: {
        name: 'camelCase',
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
    },

    snake_case: {
        name: 'snake_case',
        func: function(text) {
            return text.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s.toLowerCase()).join('_');
        },
        preview: function(text) {
            if (!text) return '[snake]';
            return this.func(text);
        }
    },

    kebab_case: {
        name: 'kebab-case',
        func: function(text) {
            return text.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s.toLowerCase()).join('-');
        },
        preview: function(text) {
            if (!text) return '[kebab]';
            return this.func(text);
        }
    },

    random_case: {
        name: 'Random Case',
        func: function(text) {
            return [...text].map(c => /[a-z]/i.test(c) ? (Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()) : c).join('');
        },
        preview: function(text) {
            if (!text) return '[RaNdOm]';
            return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
        }
    },

    disemvowel: {
        name: 'Disemvowel',
        func: function(text) {
            return text.replace(/[aeiouAEIOU]/g, '');
        },
        preview: function(text) {
            if (!text) return '[dsmvwl]';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        }
    },

    // Emoji letters (Regional Indicator Letters)
    regional_indicator: {
        name: 'Regional Indicator Letters',
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
        reverse: undefined
    },

    // Fraktur (Mathematical Fraktur letters)
    fraktur: {
        name: 'Fraktur',
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
    },

    // Cyrillic lookalike stylization
    cyrillic_stylized: {
        name: 'Cyrillic Stylized',
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
    },

    // Simple romaji <-> Katakana converter (approximate)
    katakana: {
        name: 'Katakana',
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
    },

    // Romaji <-> Hiragana (approximate)
    hiragana: {
        name: 'Hiragana',
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
    },

    // Emoji Speak (word → emoji, digits → keycaps)
    emoji_speak: {
        name: 'Emoji Speak',
        wordMap: {
            'love':'❤️','heart':'❤️','fire':'🔥','cool':'😎','ok':'👌','star':'⭐','poop':'💩','yes':'✅','no':'❌',
            'up':'⬆️','down':'⬇️','left':'⬅️','right':'➡️','question':'❓','exclamation':'❗'
        },
        digitMap: {'0':'0️⃣','1':'1️⃣','2':'2️⃣','3':'3️⃣','4':'4️⃣','5':'5️⃣','6':'6️⃣','7':'7️⃣','8':'8️⃣','9':'9️⃣'},
        func: function(text) {
            // replace digits
            let out = [...text].map(c => this.digitMap[c] || c).join('');
            // replace words (case-insensitive)
            for (const [word, emoji] of Object.entries(this.wordMap)) {
                const re = new RegExp(`\\b${word}\\b`, 'gi');
                out = out.replace(re, emoji);
            }
            return out;
        },
        preview: function(text) {
            if (!text) return '1️⃣2️⃣3️⃣ ✅';
            return this.func(text.slice(0, 12)) + (text.length > 12 ? '...' : '');
        },
        reverse: function(text) {
            let out = text;
            // reverse digits
            for (const [d, em] of Object.entries(this.digitMap)) {
                const re = new RegExp(em.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1'), 'g');
                out = out.replace(re, d);
            }
            // reverse words
            for (const [word, emoji] of Object.entries(this.wordMap)) {
                const re = new RegExp(emoji.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1'), 'g');
                out = out.replace(re, word);
            }
            return out;
        }
    },

    // Additional Ciphers
    atbash: {
        name: 'Atbash Cipher',
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
    },

    rot5: {
        name: 'ROT5',
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
    },

    // Unicode scripts
    superscript: {
        name: 'Superscript',
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
    },

    // Unicode utilities
    normalize_nfc: {
        name: 'Unicode Normalize (NFC)',
        func: function(text) { try { return text.normalize('NFC'); } catch (_) { return text; } },
        preview: function(text) { return this.func(text); }
    },
    normalize_nfd: {
        name: 'Unicode Normalize (NFD)',
        func: function(text) { try { return text.normalize('NFD'); } catch (_) { return text; } },
        preview: function(text) { return this.func(text); }
    },
    strip_diacritics: {
        name: 'Strip Diacritics',
        func: function(text) {
            try {
                return text.normalize('NFD').replace(/\p{M}+/gu, '');
            } catch (_) {
                return text.replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]+/g,'');
            }
        },
        preview: function(text) { return this.func(text); }
    },
    unicode_escape: {
        name: 'Unicode Escape (\\u)',
        func: function(text) {
            const parts = Array.from(text).map(ch => {
                const cp = ch.codePointAt(0);
                if (cp >= 32 && cp <= 126 && ch !== '\\' && ch !== '"') return ch;
                if (cp <= 0xFFFF) return `\\u${cp.toString(16).padStart(4,'0')}`;
                return `\\u{${cp.toString(16)}}`;
            });
            return parts.join('');
        },
        preview: function(text) { return this.func(text.slice(0,4)) + (text.length>4?'...':''); },
        reverse: function(text) {
            if (!text) return '';
            // Handle \u{XXXX}, \uXXXX, \xXX, and common escapes
            let out = text
                .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_,hex)=>String.fromCodePoint(parseInt(hex,16)))
                .replace(/\\u([0-9a-fA-F]{4})/g, (_,hex)=>String.fromCharCode(parseInt(hex,16)))
                .replace(/\\x([0-9a-fA-F]{2})/g, (_,hex)=>String.fromCharCode(parseInt(hex,16)))
                .replace(/\\n/g,'\n').replace(/\\r/g,'\r').replace(/\\t/g,'\t').replace(/\\\\/g,'\\').replace(/\\"/g,'"');
            return out;
        }
    },

    // Whitespace utilities
    squash_whitespace: {
        name: 'Squash Whitespace',
        func: function(text) { return text.replace(/\s+/g,' ').trim(); },
        preview: function(text) { return this.func(text); }
    },

    // Ubbi Dubbi (add 'ub' before vowels)
    ubbi_dubbi: {
        name: 'Ubbi Dubbi',
        func: function(text) {
            if (!text) return '';
            return text.replace(/([AEIOUaeiou])/g, 'ub$1');
        },
        preview: function(text) { return this.func(text || 'hello'); },
        reverse: function(text) {
            if (!text) return '';
            return text.replace(/ub([AEIOUaeiou])/g, '$1');
        }
    },

    // Rövarspråket (Robber's language): consonant -> consonant + 'o' + consonant
    rovarspraket: {
        name: 'Rövarspråket',
        func: function(text) {
            if (!text) return '';
            return text.replace(/([b-df-hj-np-tv-z])/gi, (m) => m + 'o' + m);
        },
        preview: function(text) { return this.func(text || 'robber'); },
        reverse: function(text) {
            if (!text) return '';
            return text.replace(/([b-df-hj-np-tv-z])o\1/gi, '$1');
        }
    },

    subscript: {
        name: 'Subscript',
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
    },

    // Formatting fun
    alternating_case: {
        name: 'Alternating Case',
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
        }
    },

    reverse_words: {
        name: 'Reverse Words',
        func: function(text) {
            return text.split(/(\s+)/).reverse().join('');
        },
        preview: function(text) {
            if (!text) return '[rev words]';
            return this.func(text.split(/\s+/).slice(0,2).join(' ')) + '...';
        },
        reverse: function(text) {
            // Reversing words twice restores
            return this.func(text);
        }
    },
    
    // Special Randomizer Functions
    randomizer: {
        name: 'Random Mix',
        
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
        
        // Attempt to decode a mixed-transform sentence
        reverse: function(text) {
            if (!this.lastTransformMap) {
                return '[Cannot decode - no transform map available]';
            }
            
            // This is a simplified reverse - in practice, mixed decoding is complex
            // because we need to identify which transform was applied to which word
            return '[Mixed decode - use Universal Decoder for individual words]';
        },
        
        // Get info about the last randomization
        getLastTransformInfo: function() {
            return this.lastTransformMap || [];
        }
    }
};

// Export transforms for use in app.js
window.transforms = transforms;
