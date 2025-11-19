// Transformers Index - Loads all transform modules

// Base Encodings
import base64 from './base-encodings/base64.js';
import base64url from './base-encodings/base64url.js';
import base32 from './base-encodings/base32.js';
import base58 from './base-encodings/base58.js';
import base62 from './base-encodings/base62.js';
import base45 from './base-encodings/base45.js';
import hex from './base-encodings/hex.js';
import binary from './base-encodings/binary.js';
import ascii85 from './base-encodings/ascii85.js';

// Ciphers
import rot13 from './ciphers/rot13.js';
import rot47 from './ciphers/rot47.js';
import rot18 from './ciphers/rot18.js';
import rot5 from './ciphers/rot5.js';
import caesar from './ciphers/caesar.js';
import atbash from './ciphers/atbash.js';
import vigenere from './ciphers/vigenere.js';
import rail_fence from './ciphers/rail-fence.js';
import affine from './ciphers/affine.js';
import baconian from './ciphers/baconian.js';

// Unicode Styles
import upside_down from './unicode-styles/upside-down.js';
import bubble from './unicode-styles/bubble.js';
import cursive from './unicode-styles/cursive.js';
import zalgo from './unicode-styles/zalgo.js';
import vaporwave from './unicode-styles/vaporwave.js';
import small_caps from './unicode-styles/small-caps.js';
import fullwidth from './unicode-styles/fullwidth.js';
import strikethrough from './unicode-styles/strikethrough.js';
import underline from './unicode-styles/underline.js';
import medieval from './unicode-styles/medieval.js';
import monospace from './unicode-styles/monospace.js';
import doubleStruck from './unicode-styles/doubleStruck.js';
import mathematical from './unicode-styles/mathematical.js';
import fraktur from './unicode-styles/fraktur.js';
import superscript from './unicode-styles/superscript.js';
import subscript from './unicode-styles/subscript.js';
import mirror from './unicode-styles/mirror.js';

// Text Formatting
import reverse from './text-formatting/reverse.js';
import alternating_case from './text-formatting/alternating-case.js';
import title_case from './text-formatting/title-case.js';
import sentence_case from './text-formatting/sentence-case.js';
import camel_case from './text-formatting/camel-case.js';
import snake_case from './text-formatting/snake-case.js';
import kebab_case from './text-formatting/kebab-case.js';
import random_case from './text-formatting/random-case.js';
import reverse_words from './text-formatting/reverse-words.js';
import pigLatin from './text-formatting/pigLatin.js';
import ubbi_dubbi from './text-formatting/ubbi-dubbi.js';
import rovarspraket from './text-formatting/rovarspraket.js';
import disemvowel from './text-formatting/disemvowel.js';
import leetspeak from './text-formatting/leetspeak.js';
import url from './text-formatting/url.js';
import html from './text-formatting/html.js';
import qwerty_shift from './text-formatting/qwerty-shift.js';

// Languages
import morse from './languages/morse.js';
import braille from './languages/braille.js';
import nato from './languages/nato.js';
import tap_code from './languages/tap-code.js';
import a1z26 from './languages/a1z26.js';
import semaphore from './languages/semaphore.js';

// Fantasy Languages
import elder_futhark from './fantasy/elder-futhark.js';
import quenya from './fantasy/quenya.js';
import tengwar from './fantasy/tengwar.js';
import klingon from './fantasy/klingon.js';
import dovahzul from './fantasy/dovahzul.js';
import aurebesh from './fantasy/aurebesh.js';
import greek from './fantasy/greek.js';
import wingdings from './fantasy/wingdings.js';
import cyrillic_stylized from './fantasy/cyrillic-stylized.js';
import katakana from './fantasy/katakana.js';
import hiragana from './fantasy/hiragana.js';

// Symbols
import hieroglyphics from './symbols/hieroglyphics.js';
import ogham from './symbols/ogham.js';
import chemical from './symbols/chemical.js';
import roman_numerals from './symbols/roman-numerals.js';
import emoji_speak from './symbols/emoji-speak.js';
import regional_indicator from './symbols/regional-indicator.js';

// Special
import invisible_text from './special/invisible-text.js';
import brainfuck from './special/brainfuck.js';
import randomizer from './special/randomizer.js';

// Combine all transforms
const transforms = {
    // Base Encodings
    base64,
    base64url,
    base32,
    base58,
    base62,
    base45,
    hex,
    binary,
    ascii85,
    
    // Ciphers
    rot13,
    rot47,
    rot18,
    rot5,
    caesar,
    atbash,
    vigenere,
    rail_fence,
    affine,
    baconian,
    
    // Unicode Styles
    upside_down,
    bubble,
    cursive,
    zalgo,
    vaporwave,
    small_caps,
    fullwidth,
    strikethrough,
    underline,
    medieval,
    monospace,
    doubleStruck,
    mathematical,
    fraktur,
    superscript,
    subscript,
    mirror,
    
    // Text Formatting
    reverse,
    alternating_case,
    title_case,
    sentence_case,
    camel_case,
    snake_case,
    kebab_case,
    random_case,
    reverse_words,
    pigLatin,
    ubbi_dubbi,
    rovarspraket,
    disemvowel,
    leetspeak,
    url,
    html,
    qwerty_shift,
    
    // Languages
    morse,
    braille,
    nato,
    tap_code,
    a1z26,
    semaphore,
    
    // Fantasy Languages
    elder_futhark,
    quenya,
    tengwar,
    klingon,
    dovahzul,
    aurebesh,
    greek,
    wingdings,
    cyrillic_stylized,
    katakana,
    hiragana,
    
    // Symbols
    hieroglyphics,
    ogham,
    chemical,
    roman_numerals,
    emoji_speak,
    regional_indicator,
    
    // Special
    invisible_text,
    brainfuck,
    randomizer
};

// Export for both ES6 modules and browser global
export default transforms;

// Also expose as window.transforms for backward compatibility
if (typeof window !== 'undefined') {
    window.transforms = transforms;
    window.encoders = transforms; // alias
}

