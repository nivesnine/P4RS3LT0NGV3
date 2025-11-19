/**
 * Browser Loader for Transforms
 * Synchronously loads all transform modules for browser use
 * This converts ES6 modules to immediately-available window.transforms
 */

(function() {
    'use strict';
    
    // This will be populated by loading all individual transform files
    const transforms = {};
    
    // Helper to load a transform file synchronously
    function loadTransformSync(path, name) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false); // false = synchronous
        xhr.send();
        
        if (xhr.status === 200) {
            try {
                // Create isolated scope and extract the export
                const transformCode = xhr.responseText;
                const cleanCode = transformCode
                    .replace(/^\/\/.*$/gm, '') // Remove comments
                    .replace(/^export default\s*/, 'return '); // Convert export to return
                
                const transformFunc = new Function(cleanCode);
                transforms[name] = transformFunc();
            } catch (e) {
                console.error(`Error loading transform ${name}:`, e);
            }
        } else {
            console.error(`Failed to load ${path}: ${xhr.status}`);
        }
    }
    
    // Base Encodings
    loadTransformSync('js/transformers/base-encodings/base64.js', 'base64');
    loadTransformSync('js/transformers/base-encodings/base64url.js', 'base64url');
    loadTransformSync('js/transformers/base-encodings/base32.js', 'base32');
    loadTransformSync('js/transformers/base-encodings/base58.js', 'base58');
    loadTransformSync('js/transformers/base-encodings/base62.js', 'base62');
    loadTransformSync('js/transformers/base-encodings/base45.js', 'base45');
    loadTransformSync('js/transformers/base-encodings/hex.js', 'hex');
    loadTransformSync('js/transformers/base-encodings/binary.js', 'binary');
    loadTransformSync('js/transformers/base-encodings/ascii85.js', 'ascii85');
    
    // Ciphers
    loadTransformSync('js/transformers/ciphers/rot13.js', 'rot13');
    loadTransformSync('js/transformers/ciphers/rot47.js', 'rot47');
    loadTransformSync('js/transformers/ciphers/rot18.js', 'rot18');
    loadTransformSync('js/transformers/ciphers/rot5.js', 'rot5');
    loadTransformSync('js/transformers/ciphers/caesar.js', 'caesar');
    loadTransformSync('js/transformers/ciphers/atbash.js', 'atbash');
    loadTransformSync('js/transformers/ciphers/vigenere.js', 'vigenere');
    loadTransformSync('js/transformers/ciphers/rail-fence.js', 'rail_fence');
    loadTransformSync('js/transformers/ciphers/affine.js', 'affine');
    loadTransformSync('js/transformers/ciphers/baconian.js', 'baconian');
    
    // Unicode Styles
    loadTransformSync('js/transformers/unicode-styles/upside-down.js', 'upside_down');
    loadTransformSync('js/transformers/unicode-styles/bubble.js', 'bubble');
    loadTransformSync('js/transformers/unicode-styles/cursive.js', 'cursive');
    loadTransformSync('js/transformers/unicode-styles/zalgo.js', 'zalgo');
    loadTransformSync('js/transformers/unicode-styles/vaporwave.js', 'vaporwave');
    loadTransformSync('js/transformers/unicode-styles/small-caps.js', 'small_caps');
    loadTransformSync('js/transformers/unicode-styles/fullwidth.js', 'fullwidth');
    loadTransformSync('js/transformers/unicode-styles/strikethrough.js', 'strikethrough');
    loadTransformSync('js/transformers/unicode-styles/underline.js', 'underline');
    loadTransformSync('js/transformers/unicode-styles/medieval.js', 'medieval');
    loadTransformSync('js/transformers/unicode-styles/monospace.js', 'monospace');
    loadTransformSync('js/transformers/unicode-styles/doubleStruck.js', 'doubleStruck');
    loadTransformSync('js/transformers/unicode-styles/mathematical.js', 'mathematical');
    loadTransformSync('js/transformers/unicode-styles/fraktur.js', 'fraktur');
    loadTransformSync('js/transformers/unicode-styles/superscript.js', 'superscript');
    loadTransformSync('js/transformers/unicode-styles/subscript.js', 'subscript');
    loadTransformSync('js/transformers/unicode-styles/mirror.js', 'mirror');
    
    // Text Formatting
    loadTransformSync('js/transformers/text-formatting/reverse.js', 'reverse');
    loadTransformSync('js/transformers/text-formatting/alternating-case.js', 'alternating_case');
    loadTransformSync('js/transformers/text-formatting/title-case.js', 'title_case');
    loadTransformSync('js/transformers/text-formatting/sentence-case.js', 'sentence_case');
    loadTransformSync('js/transformers/text-formatting/camel-case.js', 'camel_case');
    loadTransformSync('js/transformers/text-formatting/snake-case.js', 'snake_case');
    loadTransformSync('js/transformers/text-formatting/kebab-case.js', 'kebab_case');
    loadTransformSync('js/transformers/text-formatting/random-case.js', 'random_case');
    loadTransformSync('js/transformers/text-formatting/reverse-words.js', 'reverse_words');
    loadTransformSync('js/transformers/text-formatting/pigLatin.js', 'pigLatin');
    loadTransformSync('js/transformers/text-formatting/ubbi-dubbi.js', 'ubbi_dubbi');
    loadTransformSync('js/transformers/text-formatting/rovarspraket.js', 'rovarspraket');
    loadTransformSync('js/transformers/text-formatting/disemvowel.js', 'disemvowel');
    loadTransformSync('js/transformers/text-formatting/leetspeak.js', 'leetspeak');
    loadTransformSync('js/transformers/text-formatting/url.js', 'url');
    loadTransformSync('js/transformers/text-formatting/html.js', 'html');
    loadTransformSync('js/transformers/text-formatting/qwerty-shift.js', 'qwerty_shift');
    
    // Languages
    loadTransformSync('js/transformers/languages/morse.js', 'morse');
    loadTransformSync('js/transformers/languages/braille.js', 'braille');
    loadTransformSync('js/transformers/languages/nato.js', 'nato');
    loadTransformSync('js/transformers/languages/tap-code.js', 'tap_code');
    loadTransformSync('js/transformers/languages/a1z26.js', 'a1z26');
    loadTransformSync('js/transformers/languages/semaphore.js', 'semaphore');
    
    // Fantasy Languages
    loadTransformSync('js/transformers/fantasy/elder-futhark.js', 'elder_futhark');
    loadTransformSync('js/transformers/fantasy/quenya.js', 'quenya');
    loadTransformSync('js/transformers/fantasy/tengwar.js', 'tengwar');
    loadTransformSync('js/transformers/fantasy/klingon.js', 'klingon');
    loadTransformSync('js/transformers/fantasy/dovahzul.js', 'dovahzul');
    loadTransformSync('js/transformers/fantasy/aurebesh.js', 'aurebesh');
    loadTransformSync('js/transformers/fantasy/greek.js', 'greek');
    loadTransformSync('js/transformers/fantasy/wingdings.js', 'wingdings');
    loadTransformSync('js/transformers/fantasy/cyrillic-stylized.js', 'cyrillic_stylized');
    loadTransformSync('js/transformers/fantasy/katakana.js', 'katakana');
    loadTransformSync('js/transformers/fantasy/hiragana.js', 'hiragana');
    
    // Symbols
    loadTransformSync('js/transformers/symbols/hieroglyphics.js', 'hieroglyphics');
    loadTransformSync('js/transformers/symbols/ogham.js', 'ogham');
    loadTransformSync('js/transformers/symbols/chemical.js', 'chemical');
    loadTransformSync('js/transformers/symbols/roman-numerals.js', 'roman_numerals');
    loadTransformSync('js/transformers/symbols/emoji-speak.js', 'emoji_speak');
    loadTransformSync('js/transformers/symbols/regional-indicator.js', 'regional_indicator');
    
    // Special
    loadTransformSync('js/transformers/special/invisible-text.js', 'invisible_text');
    loadTransformSync('js/transformers/special/brainfuck.js', 'brainfuck');
    loadTransformSync('js/transformers/special/randomizer.js', 'randomizer');
    
    // Expose to window
    window.transforms = transforms;
    window.encoders = transforms; // Alias for compatibility
})();

