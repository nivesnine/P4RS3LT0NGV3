import streamlit as st
import base64
import pyperclip
from PIL import Image
import io
import zlib
import numpy as np
import re
import logging
import random
from typing import List, Dict, Optional
from string import ascii_lowercase

# Import additional transformations
from text_transforms import (
    to_upside_down, to_elder_futhark, to_vaporwave, to_zalgo,
    to_unicode_circled, to_small_caps, to_braille
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('parseltongue')

# Set page config with dark theme and wide layout
st.set_page_config(
    page_title="Parseltongue 2.0",
    page_icon="🐍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for dark hacker theme
st.markdown("""
<style>
    /* Dark theme overrides */
    .stApp {
        background-color: #0E1117;
        color: #00FF41;
    }
    
    /* Matrix-style headers */
    h1, h2, h3, h4 {
        font-family: 'Courier New', monospace;
        color: #00FF41 !important;
    }
    
    /* Custom button styling */
    .stButton > button {
        background-color: #1E1E1E;
        color: #00FF41;
        border: 1px solid #00FF41;
        border-radius: 4px;
        transition: all 0.3s;
    }
    
    .stButton > button:hover {
        background-color: #00FF41;
        color: #1E1E1E;
    }
    
    /* Small emoji buttons */
    .emoji-button > button {
        padding: 5px 10px;
        min-width: 60px;
        height: 60px;
        font-size: 1.2rem;
    }
    
    /* Transform buttons */
    .transform-button > button {
        padding: 5px 10px;
        margin: 2px;
        height: auto;
    }
    
    /* Text area styling */
    .stTextArea textarea {
        background-color: #1E1E1E;
        color: #00FF41;
        border: 1px solid #00FF41;
    }
    
    /* Code block styling */
    .stCodeBlock {
        background-color: #1E1E1E !important;
    }
    
    /* Section dividers */
    .section-divider {
        border-top: 1px solid #00FF41;
        margin: 20px 0;
    }
</style>
""", unsafe_allow_html=True)

# Helper Functions
def text_to_leetspeak(text: str) -> str:
    """Convert text to leetspeak"""
    leet_dict = {
        'a': '4', 'e': '3', 'i': '1', 'l': '1',
        'o': '0', 's': '5', 't': '7', 'b': '8',
        'g': '9', 'z': '2'
    }
    return ''.join(leet_dict.get(c.lower(), c) for c in text)

def text_to_pig_latin(text: str) -> str:
    """Convert text to Pig Latin"""
    words = text.split()
    result = []
    for word in words:
        if word[0].lower() in 'aeiou':
            result.append(word + 'way')
        else:
            consonants = ''
            i = 0
            while i < len(word) and word[i].lower() not in 'aeiou':
                consonants += word[i]
                i += 1
            result.append(word[i:] + consonants + 'ay')
    return ' '.join(result)

def rot13(text: str) -> str:
    """Apply ROT13 encoding"""
    result = ''
    for char in text:
        if char.isalpha():
            ascii_offset = ord('a') if char.islower() else ord('A')
            rotated = (ord(char) - ascii_offset + 13) % 26 + ascii_offset
            result += chr(rotated)
        else:
            result += char
    return result

def to_base64(text: str) -> str:
    """Convert text to Base64"""
    if not text:
        return ""
    return base64.b64encode(text.encode('utf-8')).decode('utf-8')

def to_binary(text: str) -> str:
    """Convert text to binary"""
    if not text:
        return ""
    return ' '.join(format(ord(c), '08b') for c in text)

def to_hex(text: str) -> str:
    """Convert text to hexadecimal"""
    if not text:
        return ""
    return ' '.join(format(ord(c), '02x') for c in text)

def to_bubble_text(text: str) -> str:
    """Convert text to bubble text"""
    if not text:
        return ""
    # Map for bubble text (circled latin letters)
    bubble_map = {
        'a': '\u24d0', 'b': '\u24d1', 'c': '\u24d2', 'd': '\u24d3', 'e': '\u24d4', 'f': '\u24d5', 'g': '\u24d6', 'h': '\u24d7', 'i': '\u24d8',
        'j': '\u24d9', 'k': '\u24da', 'l': '\u24db', 'm': '\u24dc', 'n': '\u24dd', 'o': '\u24de', 'p': '\u24df', 'q': '\u24e0', 'r': '\u24e1',
        's': '\u24e2', 't': '\u24e3', 'u': '\u24e4', 'v': '\u24e5', 'w': '\u24e6', 'x': '\u24e7', 'y': '\u24e8', 'z': '\u24e9',
        'A': '\u24b6', 'B': '\u24b7', 'C': '\u24b8', 'D': '\u24b9', 'E': '\u24ba', 'F': '\u24bb', 'G': '\u24bc', 'H': '\u24bd', 'I': '\u24be',
        'J': '\u24bf', 'K': '\u24c0', 'L': '\u24c1', 'M': '\u24c2', 'N': '\u24c3', 'O': '\u24c4', 'P': '\u24c5', 'Q': '\u24c6', 'R': '\u24c7',
        'S': '\u24c8', 'T': '\u24c9', 'U': '\u24ca', 'V': '\u24cb', 'W': '\u24cc', 'X': '\u24cd', 'Y': '\u24ce', 'Z': '\u24cf',
        '0': '\u24ea', '1': '\u2460', '2': '\u2461', '3': '\u2462', '4': '\u2463', '5': '\u2464', '6': '\u2465', '7': '\u2466', '8': '\u2467', '9': '\u2468',
        ' ': ' '
    }
    return ''.join(bubble_map.get(c, c) for c in text)

def to_fullwidth(text: str) -> str:
    """Convert text to fullwidth characters"""
    if not text:
        return ""
    # Map for fullwidth text
    fullwidth_map = {
        'a': '\uff41', 'b': '\uff42', 'c': '\uff43', 'd': '\uff44', 'e': '\uff45', 'f': '\uff46', 'g': '\uff47', 'h': '\uff48', 'i': '\uff49',
        'j': '\uff4a', 'k': '\uff4b', 'l': '\uff4c', 'm': '\uff4d', 'n': '\uff4e', 'o': '\uff4f', 'p': '\uff50', 'q': '\uff51', 'r': '\uff52',
        's': '\uff53', 't': '\uff54', 'u': '\uff55', 'v': '\uff56', 'w': '\uff57', 'x': '\uff58', 'y': '\uff59', 'z': '\uff5a',
        'A': '\uff21', 'B': '\uff22', 'C': '\uff23', 'D': '\uff24', 'E': '\uff25', 'F': '\uff26', 'G': '\uff27', 'H': '\uff28', 'I': '\uff29',
        'J': '\uff2a', 'K': '\uff2b', 'L': '\uff2c', 'M': '\uff2d', 'N': '\uff2e', 'O': '\uff2f', 'P': '\uff30', 'Q': '\uff31', 'R': '\uff32',
        'S': '\uff33', 'T': '\uff34', 'U': '\uff35', 'V': '\uff36', 'W': '\uff37', 'X': '\uff38', 'Y': '\uff39', 'Z': '\uff3a',
        '0': '\uff10', '1': '\uff11', '2': '\uff12', '3': '\uff13', '4': '\uff14', '5': '\uff15', '6': '\uff16', '7': '\uff17', '8': '\uff18', '9': '\uff19',
        ' ': '\u3000', '!': '\uff01', '?': '\uff1f', '.': '\uff0e', ',': '\uff0c', ';': '\uff1b', ':': '\uff1a', '(': '\uff08', ')': '\uff09',
        '[': '\uff3b', ']': '\uff3d', '{': '\uff5b', '}': '\uff5d', '<': '\uff1c', '>': '\uff1e', '\\': '\uff3c', '/': '\uff0f', '|': '\uff5c',
        '`': '\uff40', '~': '\uff5e', '@': '\uff20', '#': '\uff03', '$': '\uff04', '%': '\uff05', '^': '\uff3e', '&': '\uff06', '*': '\uff0a',
        '-': '\uff0d', '_': '\uff3f', '+': '\uff0b', '=': '\uff1d', '"': '\uff02', '\'': '\uff07'
    }
    return ''.join(fullwidth_map.get(c, c) for c in text)

def to_morse(text: str) -> str:
    """Convert text to Morse code"""
    if not text:
        return ""
    # Morse code mapping
    morse_map = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
        'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
        'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
    }
    return ' '.join(morse_map.get(c.lower(), c) for c in text)

def to_binary_ascii(text: str) -> str:
    """Convert text to ASCII binary (with ASCII values)"""
    if not text:
        return ""
    return ' '.join(str(ord(c)) for c in text)

def to_reverse(text: str) -> str:
    """Reverse the text"""
    if not text:
        return ""
    return text[::-1]

# Define carriers for steganography with descriptions
CARRIERS = [
    {'emoji': '🐍', 'name': 'SNAKE', 'desc': 'Classic Snake'},
    {'emoji': '🐉', 'name': 'DRAGON', 'desc': 'Mystical Dragon'},
    {'emoji': '🧙', 'name': 'WIZARD', 'desc': 'Powerful Wizard'},
    {'emoji': '🔮', 'name': 'CRYSTAL', 'desc': 'Magic Crystal Ball'},
    {'emoji': '⚡', 'name': 'LIGHTNING', 'desc': 'Lightning Bolt'},
    {'emoji': '🌟', 'name': 'STAR', 'desc': 'Shining Star'},
    {'emoji': '🎭', 'name': 'MASK', 'desc': 'Theater Mask'},
    {'emoji': '🗝️', 'name': 'KEY', 'desc': 'Ancient Key'},
    {'emoji': '📜', 'name': 'SCROLL', 'desc': 'Magic Scroll'},
    {'emoji': '🔒', 'name': 'LOCK', 'desc': 'Secure Lock'}
]

def to_variation_selector(byte: int) -> str:
    """Convert a byte to a variation selector character"""
    return chr(0xFE00 + byte)

def from_variation_selector(code_point: int) -> int:
    """Convert a variation selector character back to a byte"""
    return code_point - 0xFE00

def encode_emoji(emoji: str, text: str) -> str:
    """Encode text using variation selectors"""
    if not text:
        return emoji
    
    # Convert text to binary
    binary = ''.join(format(ord(c), '08b') for c in text)
    
    # Use variation selectors to encode binary
    vs15, vs16 = '\ufe0e', '\ufe0f'
    encoded = emoji
    
    for bit in binary:
        encoded += vs15 if bit == '0' else vs16
    
    return encoded

def decode_emoji(text: str) -> str:
    """Decode text from variation selectors"""
    if not text:
        return ""
    
    # Extract variation selectors
    vs_pattern = r'[\ufe0e\ufe0f]'
    matches = re.findall(vs_pattern, text)
    
    if not matches:
        return ""
    
    # Convert variation selectors to binary
    binary = ''.join('0' if vs == '\ufe0e' else '1' for vs in matches)
    
    # Convert binary to text
    decoded = ""
    for i in range(0, len(binary), 8):
        byte = binary[i:i+8]
        if len(byte) == 8:
            decoded += chr(int(byte, 2))
    
    return decoded

def encode_invisible(text: str) -> str:
    """Encode text using Tags Unicode block (U+E0000 to U+E007F)"""
    if not text:
        return ""
    
    result = ''
    for c in text:
        # Add the character as a Tags character
        result += chr(0xE0000 + ord(c) % 0x7F)
        # Add a space from the Tags block
        result += chr(0xE0020)  # This is the space character in Tags block
    
    return result

def decode_invisible(text: str) -> str:
    """Decode text from Tags Unicode block (U+E0000 to U+E007F)"""
    if not text:
        return ""
    
    result = ''
    # Filter valid Tags characters
    chars = [c for c in text if 0xE0000 <= ord(c) <= 0xE007F]
    
    for c in chars:
        if ord(c) != 0xE0020:  # Skip the space character
            # Convert back from Tags block
            original = chr((ord(c) - 0xE0000) % 128)
            result += original
    
    return result

def encode_image_steganography(image: Image.Image, message: str, plane: str = 'red') -> Image.Image:
    """Encode a message into an image using LSB steganography"""
    # Convert the image to RGB if it's not already
    img = image.convert('RGB')
    
    # Get the image data as a numpy array
    data = np.array(img)
    
    # Convert message to binary
    binary = ''.join(format(ord(c), '08b') for c in message)
    binary += '00000000'  # Add null terminator
    
    # Get the correct color plane
    plane_idx = {'red': 0, 'green': 1, 'blue': 2}[plane]
    
    # Encode the message
    idx = 0
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            if idx < len(binary):
                # Clear the LSB and set it to the message bit
                data[i, j, plane_idx] = (data[i, j, plane_idx] & 0xFE) | int(binary[idx])
                idx += 1
    
    # Create a new image from the modified data
    encoded_image = Image.fromarray(data)
    return encoded_image

# Main App
st.title("🐍 Parseltongue 2.0")
st.markdown("""<h3 style='color: #00FF41;'>LLM Payload Crafter</h3>""", unsafe_allow_html=True)

# Create tabs for steganography and decoder
tab1, tab2 = st.tabs(["🔐 Steganography", "🔍 Universal Decoder"])

# Steganography Tab
with tab1:
    st.markdown("""<h4>✨ Emoji Steganography</h4>""", unsafe_allow_html=True)
    
    # Text input for message
    message = st.text_area("Enter your message:", key="emoji_message", placeholder="Type your message here...")
    
    if message:
        st.markdown("""<p style='color: #00FF41;'>Click an emoji to encode and copy to clipboard:</p>""", unsafe_allow_html=True)
        
        # Create a grid of emojis with their descriptions
        cols = st.columns(8)  # More columns for smaller buttons
        for i, carrier in enumerate(CARRIERS):
            with cols[i % 8]:
                # Create a smaller button with just the emoji
                button = st.button(carrier['emoji'], key=f"emoji_{i}", help=carrier['desc'])
                st.markdown("<div class='emoji-button'></div>", unsafe_allow_html=True)
                if button:
                    try:
                        # Encode the message
                        encoded = encode_emoji(carrier['emoji'], message)
                        # Copy to clipboard
                        pyperclip.copy(encoded)
                        # Show success message with preview
                        st.success(f"✅ Encoded with {carrier['name']} and copied to clipboard!")
                    except Exception as e:
                        st.error(f"Error encoding message: {str(e)}")
        
        # Add a divider
        st.markdown("<div class='section-divider'></div>", unsafe_allow_html=True)
        
        # Omni-Encoder Section
        st.markdown("""<h4>🔍 Omni-Encoder</h4>""", unsafe_allow_html=True)
        st.markdown("""<p style='color: #00FF41;'>Click to transform and copy to clipboard:</p>""", unsafe_allow_html=True)
        
        # Create a grid of transformation options - 4 columns, 4 rows
        st.markdown("<div style='display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;'></div>", unsafe_allow_html=True)
        # Use 4 rows of 4 columns each
        for row in range(4):
            transform_cols = st.columns(4)
        
        # Define transformations
        transformations = [
            {"name": "Base64", "func": to_base64, "icon": "🔢"},
            {"name": "Binary", "func": to_binary, "icon": "01"},
            {"name": "Hex", "func": to_hex, "icon": "0x"},
            {"name": "ASCII", "func": to_binary_ascii, "icon": "🔤"},
            {"name": "ROT13", "func": rot13, "icon": "🔓"},
            {"name": "Leetspeak", "func": text_to_leetspeak, "icon": "1337"},
            {"name": "Pig Latin", "func": text_to_pig_latin, "icon": "🐷"},
            {"name": "Morse", "func": to_morse, "icon": "•−•"},
            {"name": "Bubble", "func": to_bubble_text, "icon": "ⓑⓤⓑ"},
            {"name": "Fullwidth", "func": to_fullwidth, "icon": "ＦＷ"},
            {"name": "Reversed", "func": to_reverse, "icon": "⟲"},
            {"name": "Upside Down", "func": to_upside_down, "icon": "🙃"},
            {"name": "Runes", "func": to_elder_futhark, "icon": "ᚠᚢᚦᚨᚱᚲ"},
            {"name": "Vaporwave", "func": to_vaporwave, "icon": "ｖａｐｏｒ"},
            {"name": "Zalgo", "func": to_zalgo, "icon": "Z̷̢̧͝a̶̢͝l̸̨̛͝g̵̢̧̛o̵̡͘"},
            {"name": "Circled", "func": to_unicode_circled, "icon": "🅒🅘🅡"},
            {"name": "Small Caps", "func": to_small_caps, "icon": "ᴀʙᴄ"},
            {"name": "Braille", "func": to_braille, "icon": "⠃⠗⠁⠊⠇⠇⠑"}
        ]
        
        for i, transform in enumerate(transformations):
            row_idx = i // 4  # Determine which row this transform belongs to
            col_idx = i % 4   # Determine which column in the row
            
            # Only process transforms for the current row
            if row_idx < 4:  # We have 4 rows total
                with transform_cols[col_idx]:
                    # Create a button for each transformation
                    button = st.button(f"{transform['icon']} {transform['name']}", key=f"transform_{i}")
                    st.markdown("<div class='transform-button'></div>", unsafe_allow_html=True)
                    if button:
                        try:
                            # Transform the message
                            transformed = transform['func'](message)
                            # Copy to clipboard
                            pyperclip.copy(transformed)
                            # Show success message with preview
                            st.success(f"✅ {transform['name']} encoded and copied to clipboard!\n\nPreview: {transformed[:50] + '...' if len(transformed) > 50 else transformed}")
                        except Exception as e:
                            st.error(f"Error transforming message: {str(e)}")
    
    # Invisible Text Section
    st.markdown("""<h4>👻 Invisible Text</h4>""", unsafe_allow_html=True)
    invisible_input = st.text_area("Enter text to make invisible", key="invisible_input")
    if invisible_input:
        invisible_output = encode_invisible(invisible_input)
        st.text_area("Invisible text (copied to clipboard)", invisible_output, height=100)
        if st.button("📋 Copy Invisible Text", key="copy_invisible"):
            pyperclip.copy(invisible_output)
            st.success("✅ Copied to clipboard!")
    
    # Image Steganography Section
    st.markdown("""<h4>🖼️ Image Steganography</h4>""", unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        uploaded_file = st.file_uploader("Choose carrier image", type=['png', 'jpg', 'jpeg'])
        if uploaded_file:
            image = Image.open(uploaded_file)
            st.image(image, caption="Carrier Image")
    
    with col2:
        steg_message = st.text_area("Enter message to hide", key="steg_message")
        color_plane = st.selectbox("Select color plane", ["red", "green", "blue"])
        
        if uploaded_file and steg_message and st.button("🔒 Encode Message"):
            try:
                encoded_image = encode_image_steganography(image, steg_message, color_plane)
                st.image(encoded_image, caption="Encoded Image")
                
                # Save the image to a bytes buffer
                buf = io.BytesIO()
                encoded_image.save(buf, format='PNG')
                byte_im = buf.getvalue()
                
                st.download_button(
                    label="💾 Download Encoded Image",
                    data=byte_im,
                    file_name="encoded_image.png",
                    mime="image/png"
                )
            except Exception as e:
                st.error(f"Error encoding message in image: {str(e)}")

# Universal Decoder Tab
with tab2:
    st.markdown("### Text Transformation Tools")
    text_input = st.text_area("Enter text to transform", key="obfuscate_input")
    
    if text_input:
        # Create columns for different transformations
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Basic Transformations")
            st.text_area("Leetspeak:", text_to_leetspeak(text_input))
            st.text_area("Pig Latin:", text_to_pig_latin(text_input))
            st.text_area("ROT13:", rot13(text_input))
        
        with col2:
            st.markdown("#### Decodings")
            # Try to decode emoji
            emoji_decoded = decode_emoji(text_input)
            if emoji_decoded:
                st.text_area("Emoji Decoded:", emoji_decoded)
            
            # Try to decode invisible text
            invisible_decoded = decode_invisible(text_input)
            if invisible_decoded:
                st.text_area("Invisible Text Decoded:", invisible_decoded)
