// reverse transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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