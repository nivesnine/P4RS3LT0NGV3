// klingon transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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