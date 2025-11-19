// affine transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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