// rail-fence transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

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