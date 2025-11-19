/**
 * Safe Escape Sequence Parser
 * Replaces eval() with safe parsing of Unicode escape sequences
 * 
 * Handles strings like:
 * - "\ufe0e" -> '\ufe0e'
 * - "\u200B" -> '\u200B'
 * - "\\ufe0f" -> '\ufe0f'
 */

window.EscapeParser = {
    /**
     * Parse an escape sequence string safely
     * @param {string} str - String containing escape sequence (e.g., "\\ufe0e" or "\ufe0e")
     * @returns {string} - Parsed character or original string if parsing fails
     */
    parseEscapeSequence(str) {
        if (!str || typeof str !== 'string') {
            return str || '';
        }
        
        // Handle common escape sequences without eval
        const escapeMap = {
            // Variation selectors
            '\\ufe0e': '\ufe0e',
            '\\ufe0f': '\ufe0f',
            '\ufe0e': '\ufe0e',
            '\ufe0f': '\ufe0f',
            
            // Zero-width characters
            '\\u200B': '\u200B',  // ZWSP
            '\\u200C': '\u200C',  // ZWNJ
            '\\u200D': '\u200D',  // ZWJ
            '\\u2060': '\u2060',  // WORD JOINER
            '\u200B': '\u200B',
            '\u200C': '\u200C',
            '\u200D': '\u200D',
            '\u2060': '\u2060',
            
            // BOM
            '\\ufeff': '\ufeff',
            '\ufeff': '\ufeff',
            
            // Empty string handling
            '': '',
            'null': '',
            'undefined': ''
        };
        
        // Trim whitespace
        const trimmed = str.trim();
        
        // Check if it's a known escape sequence
        if (escapeMap[trimmed] !== undefined) {
            return escapeMap[trimmed];
        }
        
        // If it's already a single character (browser already parsed the escape sequence)
        // This is the most common case - HTML value="\ufe0e" gets parsed by browser
        if (trimmed.length === 1) {
            return trimmed;
        }
        
        // Handle unicode escape sequences like \uXXXX (string literal form)
        // Match patterns like: \u200B, \\u200B, \uFE0E, etc.
        // Only parse if it's clearly an escape sequence string (6+ characters)
        if (trimmed.length >= 6 && trimmed.includes('\\u')) {
            const unicodePattern = /\\u([0-9a-fA-F]{4})/i;
            const match = trimmed.match(unicodePattern);
            
            if (match) {
                try {
                    const codePoint = parseInt(match[1], 16);
                    // Validate code point range
                    if (codePoint >= 0 && codePoint <= 0x10FFFF) {
                        // Use fromCodePoint() instead of fromCharCode() for proper Unicode support
                        // This handles code points above U+FFFF correctly
                        if (typeof String.fromCodePoint === 'function') {
                            return String.fromCodePoint(codePoint);
                        } else {
                            // Fallback for older browsers (shouldn't happen in modern browsers)
                            // Only works for BMP (Basic Multilingual Plane) characters
                            if (codePoint <= 0xFFFF) {
                                return String.fromCharCode(codePoint);
                            }
                            // For code points > 0xFFFF, we'd need surrogate pairs
                            // But our use case (VS15, VS16, ZWSP, etc.) are all BMP, so this is fine
                            return String.fromCharCode(codePoint);
                        }
                    }
                } catch (e) {
                    // Invalid code point, fall through
                }
            }
        }
        
        // If it's a short string that might already be a character, return as-is
        // This handles edge cases where browser parsing might vary
        if (trimmed.length <= 2) {
            return trimmed;
        }
        
        // Fallback: return original string if we can't parse it
        // This is safer than eval() - we just return what we got
        // Better to return the string than risk breaking transformers
        return trimmed;
    }
};

