// Standard ASCII art style (default)
import BaseArtStyle from './BaseArtStyle.js';

export default new BaseArtStyle({
    name: 'Standard',
    description: 'Classic block-style ASCII art font',
    func: function(text, options) {
        const maxCharsPerLine = options?.width || 5;
        
        // ASCII art font (3x5 grid per character)
        const font = {
            'A': [' ███ ', '█   █', '█████', '█   █', '█   █'],
            'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
            'C': [' ███ ', '█   █', '█    ', '█   █', ' ███ '],
            'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
            'E': ['█████', '█    ', '████ ', '█    ', '█████'],
            'F': ['█████', '█    ', '████ ', '█    ', '█    '],
            'G': [' ███ ', '█    ', '█  ██', '█   █', ' ███ '],
            'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
            'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
            'J': ['█████', '    █', '    █', '█   █', ' ███ '],
            'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
            'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
            'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
            'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
            'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
            'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
            'Q': [' ███ ', '█   █', '█   █', '█  ██', ' ████'],
            'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
            'S': [' ███ ', '█    ', ' ███ ', '    █', ' ███ '],
            'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
            'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
            'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
            'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
            'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
            'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
            'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
            ' ': ['     ', '     ', '     ', '     ', '     '],
            '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
            '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
            '2': [' ███ ', '    █', ' ███ ', '█    ', '█████'],
            '3': [' ███ ', '    █', ' ███ ', '    █', ' ███ '],
            '4': ['█   █', '█   █', '█████', '    █', '    █'],
            '5': ['█████', '█    ', '████ ', '    █', '████ '],
            '6': [' ███ ', '█    ', '████ ', '█   █', ' ███ '],
            '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
            '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
            '9': [' ███ ', '█   █', ' ████', '    █', ' ███ ']
        };
        
        const inputLines = text.split('\n');
        const result = [];
        
        for (const inputLine of inputLines) {
            const cleaned = inputLine.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
            
            if (cleaned.length === 0) {
                // Empty line - add blank ASCII art lines
                result.push(['', '', '', '', ''].join('\n'));
                continue;
            }
            
            // Split long lines into chunks to prevent wrapping
            const chunks = [];
            for (let i = 0; i < cleaned.length; i += maxCharsPerLine) {
                chunks.push(cleaned.slice(i, i + maxCharsPerLine));
            }
            
            // Generate ASCII art for each chunk
            for (const chunk of chunks) {
                const asciiLines = ['', '', '', '', ''];
                
                // Generate ASCII art for this chunk
                for (let j = 0; j < chunk.length; j++) {
                    const char = chunk[j];
                    const charArt = font[char] || font[' '];
                    for (let i = 0; i < 5; i++) {
                        asciiLines[i] += charArt[i];
                    }
                    // Add space between characters (except after last character)
                    if (j < chunk.length - 1) {
                        for (let i = 0; i < 5; i++) {
                            asciiLines[i] += ' ';
                        }
                    }
                }
                
                result.push(asciiLines.join('\n'));
            }
        }
        
        // Join with blank lines between chunks/lines to preserve alignment
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

