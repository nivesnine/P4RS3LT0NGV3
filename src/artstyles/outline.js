// Outline ASCII art style using box drawing characters
import BaseArtStyle from './BaseArtStyle.js';

export default new BaseArtStyle({
    name: 'Outline',
    description: 'Hollow outline style using box drawing characters',
    func: function(text, options) {
        const maxCharsPerLine = options?.width || 5;
        
        // Helper function to pad strings to consistent width
        const padToWidth = (str, width) => {
            const len = str.length;
            if (len >= width) return str;
            const padding = width - len;
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
        };
        
        // Outline ASCII art font using box drawing characters
        // All lines padded to 5 characters wide
        const font = {
            'A': [' ╔═╗ ', '║ ║ ', '╠═╣ ', '║ ║ ', '║ ║ '],
            'B': ['╔═╗ ', '║ ║ ', '╠═╣ ', '║ ║ ', '╚═╝ '],
            'C': [' ╔═╗ ', '║    ', '║    ', '║    ', ' ╚═╝ '],
            'D': ['╔═╗ ', '║ ║ ', '║ ║ ', '║ ║ ', '╚═╝ '],
            'E': ['╔═══╗', '║    ', '╠═══ ', '║    ', '╚═══╝'],
            'F': ['╔═══╗', '║    ', '╠═══ ', '║    ', '║    '],
            'G': [' ╔═╗ ', '║    ', '║ ═╗ ', '║ ║ ', ' ╚═╝ '],
            'H': ['║ ║ ', '║ ║ ', '╠═╣ ', '║ ║ ', '║ ║ '],
            'I': ['╔═══╗', '  ║  ', '  ║  ', '  ║  ', '╚═══╝'],
            'J': ['╔═══╗', '   ║ ', '   ║ ', '║ ║ ', '╚═╝  '],
            'K': ['║ ║ ', '║ ╔╝ ', '╠═╝  ', '║ ╚╗ ', '║ ║ '],
            'L': ['║    ', '║    ', '║    ', '║    ', '╚═══╝'],
            'M': ['║ ║ ', '║╔╗║ ', '║║║║ ', '║║║║ ', '║╚╝║ '],
            'N': ['║ ║ ', '║╔╣ ', '║║║ ', '║╚╣ ', '║ ║ '],
            'O': [' ╔═╗ ', '║ ║ ', '║ ║ ', '║ ║ ', ' ╚═╝ '],
            'P': ['╔═╗ ', '║ ║ ', '╠═╝ ', '║   ', '║   '],
            'Q': [' ╔═╗ ', '║ ║ ', '║ ║ ', '║ ╚╗ ', ' ╚═╝╚'],
            'R': ['╔═╗ ', '║ ║ ', '╠═╝ ', '║ ╚╗ ', '║ ║ '],
            'S': [' ╔═╗ ', '╚═╗  ', ' ╔═╝ ', '╚═╝  ', ' ╚═╝ '],
            'T': ['╔═══╗', '  ║  ', '  ║  ', '  ║  ', '  ║  '],
            'U': ['║ ║ ', '║ ║ ', '║ ║ ', '║ ║ ', ' ╚═╝ '],
            'V': ['║ ║ ', '║ ║ ', '║ ║ ', '╚╗╔╝ ', ' ╚╝  '],
            'W': ['║ ║ ', '║ ║ ', '║╔╗║ ', '║║║║ ', '╚╝╚╝ '],
            'X': ['║ ║ ', '╚╗╔╝ ', ' ╚╝  ', '╔╗╚╗ ', '║ ║ '],
            'Y': ['║ ║ ', '╚╗╔╝ ', '  ║  ', '  ║  ', '  ║  '],
            'Z': ['╔═══╗', '  ╔╝ ', ' ╔╝  ', '╔╝   ', '╚═══╝'],
            ' ': ['     ', '     ', '     ', '     ', '     '],
            '0': [' ╔═╗ ', '║ ║ ', '║ ║ ', '║ ║ ', ' ╚═╝ '],
            '1': ['  ║  ', ' ╔╝  ', '  ║  ', '  ║  ', '╔═══╗'],
            '2': [' ╔═╗ ', '  ╔╝ ', ' ╔╝  ', '╔╝   ', '╚═══╝'],
            '3': [' ╔═╗ ', '  ╔╝ ', ' ══╣ ', '  ╚╗ ', ' ╚═╝ '],
            '4': ['║ ║ ', '║ ║ ', '╠═╣ ', '  ║  ', '  ║  '],
            '5': ['╔═══╗', '╚══╗ ', ' ╔═╝ ', '╚═╝  ', '╚═══╝'],
            '6': [' ╔═╗ ', '╔═╝  ', '╠═╗  ', '║ ║  ', ' ╚═╝ '],
            '7': ['╔═══╗', '   ║ ', '  ╔╝ ', ' ╔╝  ', '╔╝   '],
            '8': [' ╔═╗ ', '╠═╣ ', '╔═╣ ', '║ ║ ', ' ╚═╝ '],
            '9': [' ╔═╗ ', '║ ║ ', ' ╚═╣ ', '  ║  ', ' ╚═╝ ']
        };
        
        const inputLines = text.split('\n');
        const result = [];
        
        for (const inputLine of inputLines) {
            const cleaned = inputLine.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
            
            if (cleaned.length === 0) {
                result.push(['', '', '', '', ''].join('\n'));
                continue;
            }
            
            const chunks = [];
            for (let i = 0; i < cleaned.length; i += maxCharsPerLine) {
                chunks.push(cleaned.slice(i, i + maxCharsPerLine));
            }
            
            for (const chunk of chunks) {
                const asciiLines = ['', '', '', '', ''];
                
                for (let j = 0; j < chunk.length; j++) {
                    const char = chunk[j];
                    const charArt = font[char] || font[' '];
                    for (let i = 0; i < 5; i++) {
                        // Pad each line to exactly 5 characters
                        asciiLines[i] += padToWidth(charArt[i], 5);
                    }
                    if (j < chunk.length - 1) {
                        for (let i = 0; i < 5; i++) {
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
            default: 5,
            min: 1,
            max: 20,
            description: 'Controls output width (more chars = wider output)'
        }
    ]
});
