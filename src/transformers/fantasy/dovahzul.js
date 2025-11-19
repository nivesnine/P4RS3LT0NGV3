// dovahzul transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
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