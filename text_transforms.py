def to_upside_down(text: str) -> str:
    """Convert text to upside down characters"""
    if not text:
        return ""
    # Map for upside down text
    upside_down_map = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ',
        'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
        's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
        'A': '∀', 'B': 'B', 'C': 'Ɔ', 'D': 'D', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I',
        'J': 'ſ', 'K': 'K', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'R',
        'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
        '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': ',,', "'": ',', '(': ')', ')': '(', '[': ']', ']': '[',
        '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾', ' ': ' '
    }
    return ''.join(upside_down_map.get(c, c) for c in text)[::-1]  # Reverse for proper effect

def to_elder_futhark(text: str) -> str:
    """Convert text to Elder Futhark runes"""
    if not text:
        return ""
    # Map for Elder Futhark runes
    rune_map = {
        'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᛲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ',
        'j': 'ᛃ', 'k': 'ᛲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᛲᛩ', 'r': 'ᚱ',
        's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᛩ', 'w': 'ᛩ', 'x': 'ᛲᛋ', 'y': 'ᛁ', 'z': 'ᛉ',
        'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᛲ', 'D': 'ᛞ', 'E': 'ᛖ', 'F': 'ᚠ', 'G': 'ᚷ', 'H': 'ᚺ', 'I': 'ᛁ',
        'J': 'ᛃ', 'K': 'ᛲ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᛟ', 'P': 'ᛈ', 'Q': 'ᛲᛩ', 'R': 'ᚱ',
        'S': 'ᛋ', 'T': 'ᛏ', 'U': 'ᚢ', 'V': 'ᛩ', 'W': 'ᛩ', 'X': 'ᛲᛋ', 'Y': 'ᛁ', 'Z': 'ᛉ',
        ' ': ' '
    }
    return ''.join(rune_map.get(c, c) for c in text)

def to_vaporwave(text: str) -> str:
    """Convert text to vaporwave aesthetic (wide spaced)"""
    if not text:
        return ""
    return ' '.join(c for c in text)

import random

def to_zalgo(text: str) -> str:
    """Convert text to zalgo (glitchy) text"""
    if not text:
        return ""
    # Zalgo diacritical marks
    zalgo_marks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308',
        '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311',
        '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u031B', '\u033D', '\u033E', '\u033F',
        '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0345', '\u0346', '\u0347', '\u0348',
        '\u0349', '\u034A', '\u034B', '\u034C', '\u034D', '\u034E', '\u034F'
    ]
    
    result = ''
    for c in text:
        result += c
        # Add 1-3 random zalgo marks to each character
        for _ in range(random.randint(1, 3)):
            result += random.choice(zalgo_marks)
    return result

def to_unicode_circled(text: str) -> str:
    """Convert text to unicode circled characters"""
    if not text:
        return ""
    # Map for circled text
    circled_map = {
        'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘',
        'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡',
        's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩',
        'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘',
        'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡',
        'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩',
        '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
        ' ': ' '
    }
    return ''.join(circled_map.get(c, c) for c in text)

def to_small_caps(text: str) -> str:
    """Convert text to small caps"""
    if not text:
        return ""
    # Map for small caps
    small_caps_map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I',
        'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
        'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
        ' ': ' '
    }
    return ''.join(small_caps_map.get(c, c) for c in text)

def to_braille(text: str) -> str:
    """Convert text to braille"""
    if not text:
        return ""
    # Map for braille
    braille_map = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊',
        'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗',
        's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
        'A': '⠠⠁', 'B': '⠠⠃', 'C': '⠠⠉', 'D': '⠠⠙', 'E': '⠠⠑', 'F': '⠠⠋', 'G': '⠠⠛', 'H': '⠠⠓', 'I': '⠠⠊',
        'J': '⠠⠚', 'K': '⠠⠅', 'L': '⠠⠇', 'M': '⠠⠍', 'N': '⠠⠝', 'O': '⠠⠕', 'P': '⠠⠏', 'Q': '⠠⠟', 'R': '⠠⠗',
        'S': '⠠⠎', 'T': '⠠⠞', 'U': '⠠⠥', 'V': '⠠⠧', 'W': '⠠⠺', 'X': '⠠⠭', 'Y': '⠠⠽', 'Z': '⠠⠵',
        '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
        ' ': ' '
    }
    return ''.join(braille_map.get(c, c) for c in text)

def to_bubble(text: str) -> str:
    """Convert text to bubble letters"""
    if not text:
        return ""
    bubble_map = {
        'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ',
        'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ',
        's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
        'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ',
        'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ',
        'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
        ' ': ' '
    }
    return ''.join(bubble_map.get(c, c) for c in text)

def to_medieval(text: str) -> str:
    """Convert text to medieval-style characters"""
    if not text:
        return ""
    medieval_map = {
        'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦',
        'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯',
        's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
        'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ',
        'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ',
        'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
        ' ': ' '
    }
    return ''.join(medieval_map.get(c, c) for c in text)

def to_morse(text: str) -> str:
    """Convert text to Morse code"""
    if not text:
        return ""
    morse_map = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
        'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
        'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
        's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': ' '
    }
    return ' '.join(morse_map.get(c.lower(), c) for c in text)

def to_binary(text: str) -> str:
    """Convert text to binary"""
    if not text:
        return ""
    return ' '.join(format(ord(c), '08b') for c in text)

def to_strikethrough(text: str) -> str:
    """Convert text to strikethrough"""
    if not text:
        return ""
    return ''.join(c + '̶' for c in text)

def to_fullwidth(text: str) -> str:
    """Convert text to fullwidth characters"""
    if not text:
        return ""
    # Convert to fullwidth (shift ASCII range)
    return ''.join(chr(ord(c) + 0xFEE0) if 0x21 <= ord(c) <= 0x7E else c for c in text)

def to_mirror(text: str) -> str:
    """Convert text to mirrored characters"""
    if not text:
        return ""
    mirror_map = {
        'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ǫ', 'h': 'ʜ',
        'i': 'i', 'j': 'į', 'k': 'ʞ', 'l': '|', 'm': 'm', 'n': 'ᴎ', 'o': 'o', 'p': 'q',
        'q': 'p', 'r': 'ɿ', 's': 'ƨ', 't': 'ƚ', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
        'y': 'y', 'z': 'z', ' ': ' '
    }
    return ''.join(mirror_map.get(c.lower(), c) for c in text)[::-1]

def to_wavey(text: str) -> str:
    """Convert text to wavey style using combining characters"""
    if not text:
        return ""
    wave_marks = ['̾', '͂', '̽', '͌']
    return ''.join(c + random.choice(wave_marks) for c in text)
