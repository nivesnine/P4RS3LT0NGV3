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
            const matches = [...text.matchAll(/[\uE0000-\uE007F]/g)];
            if (!matches.length) return '';
            
            return matches
                .map(match => String.fromCharCode(match[0].codePointAt(0) - 0xE0000))
                .join('');
        }
    },
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
            const matches = [...text.matchAll(/[\uE0000-\uE007F]/g)];
            if (!matches.length) return '';
            
            return matches
                .map(match => String.fromCharCode(match[0].codePointAt(0) - 0xE0000))
                .join('');
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
        preview: function(text) {
            return this.func(text);
        },
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
        preview: function(text) {
            return this.func(text);
        },
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
            return this.func(text);
        },
        reverse: function(text) {
            // Remove spaces between characters
            return text.replace(/ /g, '');
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
            return this.func(text);
        },
        reverse: function(text) {
            return this.func(text, true);
        }
    },

    binary: {
        name: 'Binary',
        func: function(text) {
            return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            // Remove spaces and ensure we have valid binary
            const binText = text.replace(/\s+/g, '');
            let result = '';
            
            // Process 8 bits at a time
            for (let i = 0; i < binText.length; i += 8) {
                const byte = binText.substr(i, 8);
                if (byte.length === 8) {
                    result += String.fromCharCode(parseInt(byte, 2));
                }
            }
            return result;
        }
    }
    // Note: other transforms don't have reverse functions because they're not easily reversible
    // The universal decoder will only try to reverse transforms that have a reverse function
    ,
    
    // Additional transforms
    base64: {
        name: 'Base64',
        func: function(text) {
            return btoa(text);
        },
        preview: function(text) {
            return this.func(text);
        },
        reverse: function(text) {
            try {
                return atob(text);
            } catch (e) {
                return text;
            }
        }
    },
    
    hex: {
        name: 'Hexadecimal',
        func: function(text) {
            return [...text].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        },
        preview: function(text) {
            return this.func(text);
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
            return this.func(text);
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
            return this.func(text);
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
            return this.func(text);
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
    },
    
    mirror: {
        name: 'Mirror Text',
        func: function(text) {
            return [...text].reverse().join('');
        },
        preview: function(text) {
            return this.func(text);
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
            return this.func(text);
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
            return text.split(/\s+/).map(word => revMap[word.toLowerCase()] || word).join('');
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
            return this.func(text);
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
            return this.func(text);
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
            return this.func(text);
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
            return this.func(text);
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
            let result = '';
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < text.length; i++) {
                value = (value << 8) | text.charCodeAt(i);
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
            return this.func(text);
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (let i = 0; i < this.alphabet.length; i++) {
                revMap[this.alphabet[i]] = i;
            }
            return revMap;
        },
        reverse: function(text) {
            // Remove padding and whitespace
            text = text.replace(/\s+/g, '').replace(/=+$/, '');
            
            if (text.length === 0) return '';
            
            const revMap = this.reverseMap();
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
    }
};

// Export transforms for use in app.js
window.transforms = transforms;
