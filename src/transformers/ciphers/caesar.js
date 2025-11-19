// caesar transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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