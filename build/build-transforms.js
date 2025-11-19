#!/usr/bin/env node

/**
 * Build Script for Transforms
 * Bundles all individual transform modules into a single browser-ready file
 */

const fs = require('fs');
const path = require('path');

// Define the transform mapping (name -> file path)
const transforms = {
    // Base Encodings
    base64: 'base-encodings/base64.js',
    base64url: 'base-encodings/base64url.js',
    base32: 'base-encodings/base32.js',
    base58: 'base-encodings/base58.js',
    base62: 'base-encodings/base62.js',
    base45: 'base-encodings/base45.js',
    hex: 'base-encodings/hex.js',
    binary: 'base-encodings/binary.js',
    ascii85: 'base-encodings/ascii85.js',
    
    // Ciphers
    rot13: 'ciphers/rot13.js',
    rot47: 'ciphers/rot47.js',
    rot18: 'ciphers/rot18.js',
    rot5: 'ciphers/rot5.js',
    caesar: 'ciphers/caesar.js',
    atbash: 'ciphers/atbash.js',
    vigenere: 'ciphers/vigenere.js',
    rail_fence: 'ciphers/rail-fence.js',
    affine: 'ciphers/affine.js',
    baconian: 'ciphers/baconian.js',
    
    // Unicode Styles
    upside_down: 'unicode-styles/upside-down.js',
    bubble: 'unicode-styles/bubble.js',
    cursive: 'unicode-styles/cursive.js',
    zalgo: 'unicode-styles/zalgo.js',
    vaporwave: 'unicode-styles/vaporwave.js',
    small_caps: 'unicode-styles/small-caps.js',
    fullwidth: 'unicode-styles/fullwidth.js',
    strikethrough: 'unicode-styles/strikethrough.js',
    underline: 'unicode-styles/underline.js',
    medieval: 'unicode-styles/medieval.js',
    monospace: 'unicode-styles/monospace.js',
    doubleStruck: 'unicode-styles/doubleStruck.js',
    mathematical: 'unicode-styles/mathematical.js',
    fraktur: 'unicode-styles/fraktur.js',
    superscript: 'unicode-styles/superscript.js',
    subscript: 'unicode-styles/subscript.js',
    mirror: 'unicode-styles/mirror.js',
    
    // Text Formatting
    reverse: 'text-formatting/reverse.js',
    alternating_case: 'text-formatting/alternating-case.js',
    title_case: 'text-formatting/title-case.js',
    sentence_case: 'text-formatting/sentence-case.js',
    camel_case: 'text-formatting/camel-case.js',
    snake_case: 'text-formatting/snake-case.js',
    kebab_case: 'text-formatting/kebab-case.js',
    random_case: 'text-formatting/random-case.js',
    reverse_words: 'text-formatting/reverse-words.js',
    pigLatin: 'text-formatting/pigLatin.js',
    ubbi_dubbi: 'text-formatting/ubbi-dubbi.js',
    rovarspraket: 'text-formatting/rovarspraket.js',
    disemvowel: 'text-formatting/disemvowel.js',
    leetspeak: 'text-formatting/leetspeak.js',
    url: 'text-formatting/url.js',
    html: 'text-formatting/html.js',
    qwerty_shift: 'text-formatting/qwerty-shift.js',
    
    // Languages
    morse: 'languages/morse.js',
    braille: 'languages/braille.js',
    nato: 'languages/nato.js',
    tap_code: 'languages/tap-code.js',
    a1z26: 'languages/a1z26.js',
    semaphore: 'languages/semaphore.js',
    
    // Fantasy Languages
    elder_futhark: 'fantasy/elder-futhark.js',
    quenya: 'fantasy/quenya.js',
    tengwar: 'fantasy/tengwar.js',
    klingon: 'fantasy/klingon.js',
    dovahzul: 'fantasy/dovahzul.js',
    aurebesh: 'fantasy/aurebesh.js',
    greek: 'fantasy/greek.js',
    wingdings: 'fantasy/wingdings.js',
    cyrillic_stylized: 'fantasy/cyrillic-stylized.js',
    katakana: 'fantasy/katakana.js',
    hiragana: 'fantasy/hiragana.js',
    
    // Symbols
    hieroglyphics: 'symbols/hieroglyphics.js',
    ogham: 'symbols/ogham.js',
    chemical: 'symbols/chemical.js',
    roman_numerals: 'symbols/roman-numerals.js',
    emoji_speak: 'symbols/emoji-speak.js',
    regional_indicator: 'symbols/regional-indicator.js',
    
    // Special
    invisible_text: 'special/invisible-text.js',
    brainfuck: 'special/brainfuck.js',
    randomizer: 'special/randomizer.js'
};

// First, read the BaseTransformer class
const baseTransformerPath = path.join(__dirname, '..', 'src', 'transformers', 'BaseTransformer.js');
const baseTransformerContent = fs.readFileSync(baseTransformerPath, 'utf8')
    .replace(/export\s+(default\s+)?/g, ''); // Remove export/export default statements

// Start building the output
let output = `/**
 * P4RS3LT0NGV3 Transforms - Bundled for Browser
 * Auto-generated from modular source files
 * Build date: ${new Date().toISOString()}
 */

(function() {
'use strict';

// BaseTransformer class
${baseTransformerContent}

const transforms = {};

`;

// Load and bundle each transform
const transformersDir = path.join(__dirname, '..', 'src', 'transformers');

for (const [name, filePath] of Object.entries(transforms)) {
    const fullPath = path.join(transformersDir, filePath);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Extract the object definition (remove comments, import, and export statements)
        const cleanContent = content
            .replace(/^\/\/.*$/gm, '') // Remove single-line comments
            .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '') // Remove import statements
            .replace(/export default\s*/g, '') // Remove export statement
            .trim();
        
        output += `// ${name} (from ${filePath})\n`;
        output += `transforms['${name}'] = ${cleanContent}\n\n`;
        
        console.log(`✅ Bundled: ${name}`);
    } catch (error) {
        console.error(`❌ Error bundling ${name}:`, error.message);
    }
}

// Close the IIFE and expose to window
output += `
// Expose to window
window.transforms = transforms;
window.encoders = transforms; // Alias for compatibility

})();
`;

// Write the bundled file
const outputPath = path.join(__dirname, '..', 'js', 'bundles', 'transforms-bundle.js');
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`\n✨ Bundle created: ${outputPath}`);
console.log(`📦 Size: ${(output.length / 1024).toFixed(2)} KB`);
console.log(`🔢 Total transforms: ${Object.keys(transforms).length}`);

