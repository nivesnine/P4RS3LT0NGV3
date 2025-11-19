// underline transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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