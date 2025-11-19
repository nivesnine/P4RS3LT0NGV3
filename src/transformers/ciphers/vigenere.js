// vigenere transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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