// Small/Compact ASCII art style using box drawing characters
import BaseArtStyle from './BaseArtStyle.js';

export default new BaseArtStyle({
    name: 'Small',
    description: 'Compact 3-line ASCII art using box characters',
    func: function(text, options) {
        const maxCharsPerLine = options?.width || 8;
        
        // Helper function to pad strings to consistent width
        const padToWidth = (str, width) => {
            const len = str.length;
            if (len >= width) return str;
            const padding = width - len;
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
        };
        
        // Small ASCII art font (3 lines per character) using box drawing
        // All lines padded to 4 characters wide
        const font = {
            'A': [' ╔═╗', '║ ║', '╚═╝ '],
            'B': ['╔═╗ ', '║═╣ ', '╚═╝ '],
            'C': [' ╔═╗', '║   ', ' ╚═╝'],
            'D': ['╔═╗ ', '║ ║ ', '╚═╝ '],
            'E': ['╔═══', '║══ ', '╚═══'],
            'F': ['╔═══', '║══ ', '║   '],
            'G': [' ╔═╗', '║ ═╗', ' ╚═╝'],
            'H': ['║ ║ ', '╠═╣ ', '║ ║ '],
            'I': ['╔═══', ' ║  ', '╚═══'],
            'J': ['╔═══', '  ║ ', '╚═╝ '],
            'K': ['║ ║ ', '║═╝ ', '║ ║ '],
            'L': ['║   ', '║   ', '╚═══'],
            'M': ['║╔═╗║', '║║ ║║', '║╚═╝║'],
            'N': ['║ ║ ', '║╔╣ ', '║ ║ '],
            'O': [' ╔═╗', '║ ║ ', ' ╚═╝'],
            'P': ['╔═╗ ', '║═╣ ', '║   '],
            'Q': [' ╔═╗', '║ ║ ', ' ╚═╗╝'],
            'R': ['╔═╗ ', '║═╣ ', '║ ╚ '],
            'S': [' ╔═╗', ' ╚═╗', '╚═╝ '],
            'T': ['╔═══╗', '  ║  ', '  ║  '],
            'U': ['║ ║ ', '║ ║ ', ' ╚═╝'],
            'V': ['║ ║ ', '║ ║ ', ' ╚╝ '],
            'W': ['║ ║ ', '║╔╗║ ', '╚╝╚╝ '],
            'X': ['║ ║ ', ' ╚╝  ', '║ ║ '],
            'Y': ['║ ║ ', ' ╚╗  ', '  ║  '],
            'Z': ['╔═══', ' ═╗ ', '═══╝'],
            ' ': ['    ', '    ', '    '],
            '0': [' ╔═╗', '║ ║ ', ' ╚═╝'],
            '1': [' ║ ', '╔╝  ', ' ║ '],
            '2': [' ╔═╗', ' ═╗ ', '╚═╝ '],
            '3': ['╔═══', ' ══╗', '═══╝'],
            '4': ['║ ║ ', '╚═╣ ', '  ║ '],
            '5': ['╔═══', '╚══╗', '═══╝'],
            '6': [' ╔═╗', '╔═╣ ', ' ╚═╝'],
            '7': ['╔═══', '  ║ ', ' ║  '],
            '8': [' ╔═╗', '╠═╣ ', ' ╚═╝'],
            '9': [' ╔═╗', ' ╚═╣', ' ╚═╝']
        };
        
        const inputLines = text.split('\n');
        const result = [];
        
        for (const inputLine of inputLines) {
            const cleaned = inputLine.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
            
            if (cleaned.length === 0) {
                result.push(['', '', ''].join('\n'));
                continue;
            }
            
            const chunks = [];
            for (let i = 0; i < cleaned.length; i += maxCharsPerLine) {
                chunks.push(cleaned.slice(i, i + maxCharsPerLine));
            }
            
            for (const chunk of chunks) {
                const asciiLines = ['', '', ''];
                
                for (let j = 0; j < chunk.length; j++) {
                    const char = chunk[j];
                    const charArt = font[char] || font[' '];
                    for (let i = 0; i < 3; i++) {
                        // Pad each line to exactly 4 characters (or handle special wide chars)
                        let padded = charArt[i];
                        if (char === 'M' || char === 'T') {
                            // M and T are wider, pad to 5
                            padded = padToWidth(charArt[i], 5);
                        } else {
                            padded = padToWidth(charArt[i], 4);
                        }
                        asciiLines[i] += padded;
                    }
                    if (j < chunk.length - 1) {
                        for (let i = 0; i < 3; i++) {
                            asciiLines[i] += ' ';
                        }
                    }
                }
                
                result.push(asciiLines.join('\n'));
            }
        }
        
        return result.join('\n\n');
    },
    customOptions: [
        {
            name: 'width',
            label: 'Characters Per Line',
            type: 'number',
            default: 8,
            min: 1,
            max: 30,
            description: 'Controls output width (more chars = wider output)'
        }
    ]
});
