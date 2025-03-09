// Initialize Vue app
new Vue({
    el: '#app',
    data: {
        // Theme
        isDarkTheme: true,

        // Tab Management
        activeTab: 'transforms',

        // Transform Tab
        transformInput: '',
        transformOutput: '',
        activeTransform: null,
        transforms: Object.entries(window.transforms).map(([key, transform]) => ({
            name: transform.name,
            func: transform.func.bind(transform),
            preview: transform.preview.bind(transform)
        })),

        // Steganography Tab
        emojiMessage: '',
        encodedMessage: '',
        decodeInput: '',
        decodedMessage: '',
        selectedCarrier: null,
        activeSteg: null,
        carriers: window.steganography.carriers,
        showDecoder: true,
        // Emoji Library
        emojiSearch: '',
        filteredEmojis: [...window.emojiLibrary.EMOJI_LIST],
        selectedEmoji: null
    },
    methods: {
        // Theme Toggle
        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            document.body.classList.toggle('light-theme');
        },

        // Transform Methods
        applyTransform(transform) {
            if (this.transformInput) {
                this.activeTransform = transform;
                this.transformOutput = transform.func(this.transformInput);
                this.copyToClipboard(this.transformOutput);
            }
        },
        autoTransform() {
            if (this.transformInput && this.activeTransform) {
                this.transformOutput = this.activeTransform.func(this.transformInput);
                this.copyToClipboard(this.transformOutput);
            }
        },

        // Steganography Methods
        selectCarrier(carrier) {
            // Toggle carrier selection if clicking the same one again
            if (this.selectedCarrier === carrier) {
                this.selectedCarrier = null;
                this.encodedMessage = '';
            } else {
                this.selectedCarrier = carrier;
                this.activeSteg = 'emoji';
                this.autoEncode();
            }
        },
        setStegMode(mode) {
            // Toggle mode selection if clicking the same one again
            if (this.activeSteg === mode) {
                this.activeSteg = null;
                this.encodedMessage = '';
            } else {
                this.activeSteg = mode;
                // When switching to invisible mode, clear the carrier selection
                if (mode === 'invisible') {
                    this.selectedCarrier = null;
                }
                this.autoEncode();
            }
        },
        autoEncode() {
            if (!this.emojiMessage) {
                this.encodedMessage = '';
                return;
            }

            if (this.activeSteg === 'invisible') {
                this.encodedMessage = window.steganography.encodeInvisible(this.emojiMessage);
                // Don't auto-copy to avoid clipboard permission errors
            } else if (this.selectedCarrier) {
                this.encodedMessage = window.steganography.encodeEmoji(
                    this.selectedCarrier.emoji,
                    this.emojiMessage
                );
                // Don't auto-copy to avoid clipboard permission errors
            }
        },
        autoDecode() {
            if (!this.decodeInput) {
                this.decodedMessage = '';
                return;
            }

            // Use the universal decoder
            const result = this.universalDecode(this.decodeInput);
            
            if (result) {
                this.decodedMessage = `Decoded (${result.method}): ${result.text}`;
                // Don't auto-copy to avoid clipboard permission errors
            } else {
                this.decodedMessage = 'No encoded message detected';
            }
        },
        previewInvisible(text) {
            return '[invisible]';
        },

        // Utility Methods
        async copyToClipboard(text) {
            if (!text) return;
            
            // Don't auto-copy in preview/iframe environments to avoid permission errors
            // Only copy when explicitly triggered by a button click
            const isExplicitUserAction = event && event.isTrusted;
            
            // Only try to copy if we're not in a restricted environment or it's a direct user action
            if (isExplicitUserAction) {
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Show a success notification
                    this.showNotification('<i class="fas fa-check"></i> Copied!', 'success');
                } catch (err) {
                    console.warn('Clipboard access not available:', err);
                    
                    // Try fallback method for copying (textarea method)
                    this.fallbackCopy(text);
                }
            }
        },
        
        fallbackCopy(text) {
            try {
                // Create temporary textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';  // Avoid scrolling to bottom
                document.body.appendChild(textarea);
                textarea.select();
                
                // Try the copy command
                const successful = document.execCommand('copy');
                
                // Show appropriate notification
                if (successful) {
                    this.showNotification('<i class="fas fa-check"></i> Copied!', 'success');
                } else {
                    this.showNotification('<i class="fas fa-exclamation-triangle"></i> Copy not supported', 'error');
                }
                
                // Clean up
                document.body.removeChild(textarea);
            } catch (err) {
                console.warn('Fallback copy method failed:', err);
                this.showNotification('<i class="fas fa-exclamation-triangle"></i> Copy not supported', 'error');
            }
        },
        
        showNotification(message, type = 'success') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `copy-notification ${type}`;
            notification.innerHTML = message;
            document.body.appendChild(notification);
            
            // Remove after animation
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 1000);
        },
        
        // Universal Decoder - tries all decoding methods
        universalDecode(input) {
            if (!input) return '';
            
            // Try all decoders in order
            
            // 1. Try steganography decoders
            // - Check for emoji steganography first
            // The emoji encoding uses variation selectors which are hard to see
            if (/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(input)) {
                const decoded = window.steganography.decodeEmoji(input);
                if (decoded) {
                    return { text: decoded, method: 'Emoji Steganography' };
                }
            }
            
            // - Invisible text
            let decoded = window.steganography.decodeInvisible(input);
            if (decoded) {
                return { text: decoded, method: 'Invisible Text' };
            }
            
            // 2. Try transform reversals
            // - Binary
            if (/^[01\s]+$/.test(input.trim())) {
                try {
                    // Use binary transform's reverse function if available
                    if (window.transforms.binary && window.transforms.binary.reverse) {
                        const result = window.transforms.binary.reverse(input);
                        if (result && /[\x20-\x7E]/.test(result)) { // Make sure it's readable ASCII
                            return { text: result, method: 'Binary' };
                        }
                    } else {
                        // Fallback implementation
                        const binText = input.replace(/\s+/g, '');
                        let result = '';
                        for (let i = 0; i < binText.length; i += 8) {
                            const byte = binText.substr(i, 8);
                            if (byte.length === 8) {
                                result += String.fromCharCode(parseInt(byte, 2));
                            }
                        }
                        if (result && /[\x20-\x7E]/.test(result)) { // Make sure it's readable ASCII
                            return { text: result, method: 'Binary' };
                        }
                    }
                } catch (e) { 
                    console.error('Binary decode error:', e);
                }
            }
            
            // - Morse code
            if (/^[.\-\s\/]+$/.test(input.trim())) {
                try {
                    // Use morse transform's reverse function if available
                    if (window.transforms.morse && window.transforms.morse.reverse) {
                        const result = window.transforms.morse.reverse(input);
                        if (result !== input && /[a-zA-Z0-9]/.test(result)) {
                            return { text: result, method: 'Morse Code' };
                        }
                    }
                } catch (e) {
                    console.error('Morse decode error:', e);
                }
            }
            
            // - Try reverse each transform
            for (const name in window.transforms) {
                const transform = window.transforms[name];
                if (transform.reverse) {
                    try {
                        const result = transform.reverse(input);
                        // Only return if the result is different and contains readable characters
                        if (result !== input && /[a-zA-Z0-9\s]/.test(result)) {
                            return { text: result, method: transform.name };
                        }
                    } catch (e) {
                        console.error(`Error decoding with ${name}:`, e);
                    }
                }
            }
            
            return null;
        },
        
        // Emoji Library Methods
        filterEmojis() {
            if (!this.emojiSearch) {
                this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
                this.renderEmojiGrid();
                return;
            }
            
            const searchTerm = this.emojiSearch.toLowerCase();
            this.filteredEmojis = window.emojiLibrary.EMOJI_LIST.filter(emoji => {
                // Simple search - we could enhance this with emoji names/descriptions later
                return emoji.toLowerCase().includes(searchTerm);
            });
            
            this.renderEmojiGrid();
        },
        
        selectEmoji(emoji) {
            this.selectedEmoji = emoji;
            
            // Insert the emoji at cursor position in the textarea
            const textarea = document.getElementById('steg-input');
            if (textarea) {
                const startPos = textarea.selectionStart;
                const endPos = textarea.selectionEnd;
                const currentValue = this.emojiMessage;
                
                // Insert emoji at cursor position
                this.emojiMessage = currentValue.substring(0, startPos) + emoji + currentValue.substring(endPos);
                
                // Set cursor position after the inserted emoji
                this.$nextTick(() => {
                    textarea.focus();
                    textarea.selectionStart = startPos + emoji.length;
                    textarea.selectionEnd = startPos + emoji.length;
                    
                    // Trigger encoding
                    this.autoEncode();
                });
                
                this.showNotification(`Emoji ${emoji} inserted`);
            }
        },
        
        renderEmojiGrid() {
            window.emojiLibrary.renderEmojiGrid('emoji-grid-container', this.selectEmoji.bind(this), this.filteredEmojis);
        }
    },
    // Initialize theme and components
    mounted() {
        // Apply theme
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        // Initialize emoji grid
        this.$nextTick(() => {
            this.renderEmojiGrid();
        });
    },
    // Keyboard shortcuts
    created() {
        window.addEventListener('keydown', (e) => {
            // Theme toggle
            if (e.key === 'd' || e.key === 'D') {
                this.toggleTheme();
            }
            // Tab switching
            else if (e.key === 't' || e.key === 'T') {
                this.activeTab = 'transforms';
            }
            else if (e.key === 'h' || e.key === 'H') {
                this.activeTab = 'steganography';
            }
            // Transform shortcuts (1-9)
            else if (this.activeTab === 'transforms' && e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < this.transforms.length) {
                    this.applyTransform(this.transforms[index]);
                }
            }

        });
    }
});
