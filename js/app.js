// Initialize Vue app
window.app = new Vue({
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
        // Transform categories for styling
        transformCategories: {
            encoding: ['Base64', 'Base32', 'Binary', 'Hexadecimal', 'ASCII85', 'URL Encode', 'HTML Entities'],
            cipher: ['Caesar Cipher', 'ROT13', 'ROT47', 'Morse Code'],
            visual: ['Rainbow Text', 'Strikethrough', 'Underline', 'Reverse Text'],
            format: ['Pig Latin', 'Leetspeak', 'NATO Phonetic'],
            unicode: ['Invisible Text', 'Upside Down', 'Full Width', 'Small Caps', 'Bubble', 'Braille'],
            special: ['Medieval', 'Cursive', 'Monospace', 'Double-Struck', 'Elder Futhark', 'Mirror Text', 'Zalgo']
        },
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
        
        // Universal Decoder - works on both tabs
        universalDecodeInput: '',
        universalDecodeResult: null,
        isPasteOperation: false, // Flag to track paste operations
        activeSteg: null,
        carriers: window.steganography.carriers,
        showDecoder: true,
        // Emoji Library
        filteredEmojis: [...window.emojiLibrary.EMOJI_LIST],
        selectedEmoji: null,
        
        // History of copied content
        copyHistory: [],
        maxHistoryItems: 10,
        showCopyHistory: false
    },
    methods: {
        // Get transforms grouped by category
        getTransformsByCategory(category) {
            return this.transforms.filter(transform => 
                this.transformCategories[category].includes(transform.name)
            );
        },
        
        // Theme Toggle
        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            document.body.classList.toggle('light-theme');
        },
        
        // Copy History Toggle
        toggleCopyHistory() {
            this.showCopyHistory = !this.showCopyHistory;
            console.log('Copy history toggled:', this.showCopyHistory);
            
            // If showing history panel, focus the first copy-again button if available
            if (this.showCopyHistory && this.copyHistory.length > 0) {
                this.$nextTick(() => {
                    const firstCopyButton = document.querySelector('.copy-again-button');
                    if (firstCopyButton) {
                        firstCopyButton.focus();
                    }
                });
            }
        },

        // Transform Methods
        applyTransform(transform) {
            if (this.transformInput) {
                this.activeTransform = transform;
                this.transformOutput = transform.func(this.transformInput);
                
                // Force copy and log to history
                this.forceCopyToClipboard(this.transformOutput);
                
                // Add to copy history
                this.addToCopyHistory(`Transform: ${transform.name}`, this.transformOutput);
                
                // Enhanced notification for transform and copy
                this.showNotification(`<i class="fas fa-check"></i> ${transform.name} applied and copied!`, 'success');
            }
        },
        autoTransform() {
            // Only proceed if we're in the transforms tab and have an active transform
            if (this.transformInput && this.activeTransform && this.activeTab === 'transforms') {
                this.transformOutput = this.activeTransform.func(this.transformInput);
                
                // Use forceCopyToClipboard for auto-copy
                this.forceCopyToClipboard(this.transformOutput);
                
                // Add to copy history
                this.addToCopyHistory(`Transform: ${this.activeTransform.name}`, this.transformOutput);
            }
        },
        
        // Check if a transform has a reverse function
        transformHasReverse(transform) {
            return transform && typeof transform.reverse === 'function';
        },
        
        // Decode text using the specific transform's reverse function
        decodeWithTransform(transform) {
            if (!this.transformInput || !transform || !this.transformHasReverse(transform)) {
                return;
            }
            
            try {
                // Use the transform's reverse function to decode the input
                const decodedText = transform.reverse(this.transformInput);
                
                if (decodedText !== this.transformInput) {
                    // Update the input with the decoded text
                    this.transformInput = decodedText;
                    
                    // Show a notification
                    this.showNotification(`<i class="fas fa-check"></i> Decoded using ${transform.name}`, 'success');
                    
                    // Add to copy history
                    this.addToCopyHistory(`Decoded (${transform.name})`, decodedText);
                } else {
                    this.showNotification(`<i class="fas fa-exclamation-triangle"></i> Could not decode with ${transform.name}`, 'warning');
                }
            } catch (error) {
                console.error(`Error decoding with ${transform.name}:`, error);
                this.showNotification(`<i class="fas fa-exclamation-triangle"></i> Error decoding with ${transform.name}`, 'error');
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
            // For invisible text, make it a direct action (not a toggle)
            if (mode === 'invisible') {
                // Set the mode temporarily to generate the encoded message
                this.activeSteg = mode;
                // Clear any carrier selection
                this.selectedCarrier = null;
                // Generate the encoded message
                this.autoEncode();
                
                // Auto-copy the encoded message
                if (this.encodedMessage) {
                    this.$nextTick(() => {
                        this.forceCopyToClipboard(this.encodedMessage);
                        this.showNotification('<i class="fas fa-check"></i> Invisible text created and copied!', 'success');
                        this.addToCopyHistory('Invisible Text', this.encodedMessage);
                    });
                }
            } else {
                // For other modes (like emoji), keep the toggle behavior
                if (this.activeSteg === mode) {
                    this.activeSteg = null;
                    this.encodedMessage = '';
                } else {
                    this.activeSteg = mode;
                    this.autoEncode();
                }
            }
        },
        autoEncode() {
            // Only proceed if we're in the steganography tab
            if (!this.emojiMessage || this.activeTab !== 'steganography') {
                this.encodedMessage = '';
                return;
            }

            if (this.activeSteg === 'invisible') {
                this.encodedMessage = window.steganography.encodeInvisible(this.emojiMessage);
                // Auto-copy will be handled in setStegMode method
            } else if (this.selectedCarrier) {
                this.encodedMessage = window.steganography.encodeEmoji(
                    this.selectedCarrier.emoji,
                    this.emojiMessage
                );
                // Auto-copy for emoji carrier is handled in selectEmoji method
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
                
                // Auto-copy decoded message to clipboard
                this.$nextTick(() => {
                    // Only copy the actual decoded text, not the formatted message
                    const decodedText = result.text;
                    
                    if (decodedText) {
                        // Force clipboard copy regardless of event source
                        this.forceCopyToClipboard(decodedText);
                        this.showNotification(`<i class="fas fa-check"></i> Decoded message copied!`, 'success');
                        
                        // Add to copy history
                        this.addToCopyHistory(`Decoded (${result.method})`, decodedText);
                    }
                });
            } else {
                this.decodedMessage = 'No encoded message detected';
            }
        },
        previewInvisible(text) {
            return '[invisible]';
        },

        // Add to copy history functionality
        addToCopyHistory(source, content) {
            // Create history item with timestamp
            const historyItem = {
                source: source,
                content: content,
                timestamp: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            };
            
            // Add to beginning of array (most recent first)
            this.copyHistory.unshift(historyItem);
            
            // Limit history to maxHistoryItems
            if (this.copyHistory.length > this.maxHistoryItems) {
                this.copyHistory.pop();
            }
            
            // Log history item for debugging
            console.log('Added to copy history:', historyItem);
        },
        
        // Utility Methods
        async copyToClipboard(text) {
            if (!text) return;
            
            // Always try to copy, regardless of event source
            try {
                await navigator.clipboard.writeText(text);
                
                // Show a success notification
                this.showNotification('<i class="fas fa-check"></i> Copied!', 'success');
                
                // Add to history - determine source from active tab or context
                const source = this.activeTab === 'transforms' ? 'Transform' : 'Steganography';
                this.addToCopyHistory(source, text);
            } catch (err) {
                console.warn('Clipboard access not available:', err);
                
                // Try fallback method for copying (textarea method)
                this.fallbackCopy(text);
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
                    
                    // Add to history when successful
                    // Try to determine a more specific source based on the context
                    let source = this.activeTab === 'transforms' ? 'Transform' : 'Steganography';
                    
                    // Add more context if available
                    if (this.activeTab === 'transforms' && this.activeTransform) {
                        source = `Transform: ${this.activeTransform.name}`;
                    } else if (this.activeTab === 'steganography') {
                        if (this.activeSteg === 'invisible') {
                            source = 'Invisible Text';
                        } else if (this.selectedEmoji) {
                            source = `Emoji: ${this.selectedEmoji}`;
                        }
                    }
                    
                    this.addToCopyHistory(source, text);
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
        
        // Force copy to clipboard regardless of event context
        forceCopyToClipboard(text) {
            if (!text) return;
            
            // Skip notifications if this was triggered by a paste operation
            if (this.isPasteOperation) {
                console.log('Skipping clipboard notification for paste operation');
                return;
            }
            
            console.log('Force copying to clipboard:', text);
            
            try {
                // Try to use the Clipboard API first
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            console.log('Force copy successful using Clipboard API');
                            // Show clear notification on success
                            this.showCopiedPopup();
                        })
                        .catch(err => {
                            console.warn('Force Clipboard API failed:', err);
                            this.forceFallbackCopy(text);
                            // Still show notification, as fallback might work
                            this.showCopiedPopup();
                        });
                } else {
                    // Fall back to execCommand method
                    this.forceFallbackCopy(text);
                    // Show notification for fallback method too
                    this.showCopiedPopup();
                }
            } catch (error) {
                console.error('Force copy failed:', error);
                // Try one last fallback and still show notification
                this.forceFallbackCopy(text);
                this.showCopiedPopup();
            }
        },
        
        // Fallback copy method that doesn't rely on user-initiated events
        forceFallbackCopy(text) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                textarea.style.top = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    console.log('Force fallback copy successful');
                } catch (err) {
                    console.error('Force fallback copy command failed:', err);
                }
                
                document.body.removeChild(textarea);
            } catch (err) {
                console.error('Force fallback copy method failed:', err);
            }
        },
        
        // Notification system
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
        
        // Special prominent copy notification
        showCopiedPopup() {
            // Create a more visible popup just for copy operations
            const popup = document.createElement('div');
            popup.className = 'copy-popup';
            popup.innerHTML = '<i class="fas fa-clipboard-check"></i> Copied to clipboard!';
            
            // Add to body
            document.body.appendChild(popup);
            
            // Force it to be visible and centered
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            popup.style.color = 'white';
            popup.style.padding = '15px 25px';
            popup.style.borderRadius = '5px';
            popup.style.fontSize = '18px';
            popup.style.fontWeight = 'bold';
            popup.style.zIndex = '10000';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            popup.style.textAlign = 'center';
            
            // Add fade-in animation
            popup.style.opacity = '0';
            popup.style.transition = 'opacity 0.3s ease-in-out';
            
            // Force reflow to make animation work
            void popup.offsetWidth;
            
            // Fade in
            popup.style.opacity = '1';
            
            // Remove after a short delay
            setTimeout(() => {
                popup.style.opacity = '0';
                setTimeout(() => {
                    if (popup.parentNode) {
                        document.body.removeChild(popup);
                    }
                }, 300);
            }, 1500);
        },
        
        // Run the universal decoder when input changes
        runUniversalDecode() {
            console.log('Running universal decoder with input:', this.universalDecodeInput);
            
            // Clear result if input is empty
            if (!this.universalDecodeInput) {
                this.universalDecodeResult = null;
                return;
            }
            
            // Try to decode using all available methods
            const result = this.universalDecode(this.universalDecodeInput);
            
            // Update the result
            this.universalDecodeResult = result;
            
            // Log the result
            if (result) {
                console.log(`Universal decoder found a match: ${result.method}`);
            } else {
                console.log('Universal decoder could not decode the input');
            }
        },
        
        // Universal Decoder - tries all decoding methods
        universalDecode(input) {
            if (!input) return '';
            
            // Try all decoders in order
            
            // 1. Try steganography decoders
            // - Check for emoji steganography first
            // The emoji encoding uses variation selectors which are hard to see
            if (/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(input)) {
                console.log('Detected emoji, attempting to decode...');
                const decoded = window.steganography.decodeEmoji(input);
                if (decoded) {
                    console.log('Successfully decoded emoji:', decoded);
                    return { text: decoded, method: 'Emoji Steganography' };
                } else {
                    console.log('Emoji detected but no hidden message found');
                }
            }
            
            // - Invisible text (only check if the input actually contains invisible characters)
            if (/[\uE0000-\uE007F]/.test(input)) {
                let decoded = window.steganography.decodeInvisible(input);
                if (decoded && decoded.length > 0) {
                    return { text: decoded, method: 'Invisible Text' };
                }
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

            // - Braille
            const braillePattern = /[⠀-⣿]/;
            if (braillePattern.test(input)) {
                try {
                    // Count how many braille characters are in the input
                    const brailleMatches = [...input.matchAll(/[⠀-⣿]/g)];
                    // Only proceed if there are enough braille characters (to avoid false positives)
                    if (brailleMatches.length > 2) {
                        // Create a reverse mapping for braille
                        const brailleReverseMap = {};
                        if (window.transforms.braille && window.transforms.braille.map) {
                            for (const [key, value] of Object.entries(window.transforms.braille.map)) {
                                brailleReverseMap[value] = key;
                            }
                            
                            // Decode the braille
                            let result = '';
                            for (const char of input) {
                                result += brailleReverseMap[char] || char;
                            }
                            
                            if (result !== input && /[a-zA-Z0-9]/.test(result)) {
                                return { text: result, method: 'Braille' };
                            }
                        }
                    }
                } catch (e) {
                    console.error('Braille decode error:', e);
                }
            }
            
            // - Base64
            if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
                try {
                    // Attempt to decode as base64
                    const result = atob(input.trim());
                    // Check if result is readable text
                    if (/[\x20-\x7E]{3,}/.test(result)) { // At least 3 readable ASCII chars
                        return { text: result, method: 'Base64' };
                    }
                } catch (e) {
                    // Not valid base64, continue to next decoder
                    console.error('Base64 decode error:', e);
                }
            }

            // - Upside Down text
            if (window.transforms.upside_down && window.transforms.upside_down.reverse) {
                try {
                    const result = window.transforms.upside_down.reverse(input);
                    // Check if the result is significantly different
                    if (result !== input && result.length > 3 && /[a-zA-Z0-9\s]{3,}/.test(result)) {
                        return { text: result, method: 'Upside Down' };
                    }
                } catch (e) {
                    console.error('Upside Down decode error:', e);
                }
            }

            // - Small Caps (create reverse mapping since there's no built-in decoder)
            if (window.transforms.small_caps && window.transforms.small_caps.map) {
                try {
                    // Create reverse mapping
                    const smallCapsReverseMap = {};
                    for (const [key, value] of Object.entries(window.transforms.small_caps.map)) {
                        smallCapsReverseMap[value] = key;
                    }
                    
                    // Check if input contains small caps characters
                    const smallCapsChars = Object.values(window.transforms.small_caps.map);
                    const hasSmallCaps = smallCapsChars.some(char => input.includes(char));
                    
                    if (hasSmallCaps) {
                        // Decode text
                        let result = '';
                        for (const char of input) {
                            result += smallCapsReverseMap[char] || char;
                        }
                        
                        if (result !== input && /[a-zA-Z]/.test(result)) {
                            return { text: result, method: 'Small Caps' };
                        }
                    }
                } catch (e) {
                    console.error('Small Caps decode error:', e);
                }
            }

            // - Bubble text (create reverse mapping)
            if (window.transforms.bubble && window.transforms.bubble.map) {
                try {
                    // Create reverse mapping
                    const bubbleReverseMap = {};
                    for (const [key, value] of Object.entries(window.transforms.bubble.map)) {
                        bubbleReverseMap[value] = key;
                    }
                    
                    // Check if input contains bubble characters
                    const bubbleChars = Object.values(window.transforms.bubble.map);
                    const hasBubbleChars = bubbleChars.some(char => input.includes(char));
                    
                    if (hasBubbleChars) {
                        // Decode text
                        let result = '';
                        for (const char of input) {
                            result += bubbleReverseMap[char] || char;
                        }
                        
                        if (result !== input && /[a-zA-Z]/.test(result)) {
                            return { text: result, method: 'Bubble' };
                        }
                    }
                } catch (e) {
                    console.error('Bubble decode error:', e);
                }
            }
            
            // Check for specific new transforms before trying the generic approach
            
            // - Hexadecimal
            if (/^[0-9A-Fa-f\s]+$/.test(input.trim())) {
                try {
                    if (window.transforms.hex && window.transforms.hex.reverse) {
                        const result = window.transforms.hex.reverse(input);
                        if (result && /[\x20-\x7E]{3,}/.test(result)) {
                            return { text: result, method: 'Hexadecimal' };
                        }
                    }
                } catch (e) {
                    console.error('Hex decode error:', e);
                }
            }
            
            // - URL Encoded
            if (/%[0-9A-Fa-f]{2}/.test(input)) {
                try {
                    if (window.transforms.url && window.transforms.url.reverse) {
                        const result = window.transforms.url.reverse(input);
                        if (result !== input && /[\x20-\x7E]{3,}/.test(result)) {
                            return { text: result, method: 'URL Encoded' };
                        }
                    } else {
                        // Fallback implementation
                        try {
                            const result = decodeURIComponent(input);
                            if (result !== input && /[\x20-\x7E]{3,}/.test(result)) {
                                return { text: result, method: 'URL Encoded' };
                            }
                        } catch (e) {
                            console.error('URL decode fallback error:', e);
                        }
                    }
                } catch (e) {
                    console.error('URL decode error:', e);
                }
            }
            
            // - HTML Entities
            if (/&[#a-zA-Z0-9]+;/.test(input)) {
                try {
                    if (window.transforms.html && window.transforms.html.reverse) {
                        const result = window.transforms.html.reverse(input);
                        if (result !== input && /[\x20-\x7E]{3,}/.test(result)) {
                            return { text: result, method: 'HTML Entities' };
                        }
                    }
                } catch (e) {
                    console.error('HTML entities decode error:', e);
                }
            }
            
            // - ROT13/Caesar Cipher (check if decoding produces more common English words)
            if (/^[a-zA-Z\s.,!?]+$/.test(input)) {
                try {
                    // Try ROT13 first as it's more common
                    if (window.transforms.rot13 && window.transforms.rot13.reverse) {
                        const result = window.transforms.rot13.reverse(input);
                        if (result !== input) {
                            return { text: result, method: 'ROT13' };
                        }
                    }
                    
                    // Then try Caesar cipher
                    if (window.transforms.caesar && window.transforms.caesar.reverse) {
                        const result = window.transforms.caesar.reverse(input);
                        if (result !== input) {
                            return { text: result, method: 'Caesar Cipher' };
                        }
                    }
                } catch (e) {
                    console.error('Cipher decode error:', e);
                }
            }
            
            // - Base32
            if (/^[A-Z2-7=]+$/.test(input.trim())) {
                try {
                    if (window.transforms.base32 && window.transforms.base32.reverse) {
                        const result = window.transforms.base32.reverse(input);
                        if (result && /[\x20-\x7E]{3,}/.test(result)) {
                            return { text: result, method: 'Base32' };
                        }
                    }
                } catch (e) {
                    console.error('Base32 decode error:', e);
                }
            }
            
            // - ASCII85
            if (/^<~.*~>$/.test(input.trim())) {
                try {
                    if (window.transforms.ascii85 && window.transforms.ascii85.reverse) {
                        const result = window.transforms.ascii85.reverse(input);
                        if (result && /[\x20-\x7E]{3,}/.test(result)) {
                            return { text: result, method: 'ASCII85' };
                        }
                    }
                } catch (e) {
                    console.error('ASCII85 decode error:', e);
                }
            }
            
            // - Check for Zalgo text (text with combining marks)
            const combiningMarksRegex = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/;
            if (combiningMarksRegex.test(input)) {
                try {
                    // Count the number of combining marks to ensure it's actually Zalgo text
                    // and not just text with a few accents
                    const matches = input.match(combiningMarksRegex) || [];
                    if (matches.length > 3) { // Threshold to distinguish Zalgo from normal accented text
                        // Fallback implementation to remove combining marks
                        const result = input.replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');
                        if (result !== input && result.length > 0) {
                            return { text: result, method: 'Zalgo' };
                        }
                    }
                } catch (e) {
                    console.error('Zalgo decode error:', e);
                }
            }
            
            // - Check for various Unicode text styles (medieval, cursive, monospace, double-struck)
            const unicodeStyleChecks = [
                { name: 'Medieval', transform: 'medieval' },
                { name: 'Cursive', transform: 'cursive' },
                { name: 'Monospace', transform: 'monospace' },
                { name: 'Double-Struck', transform: 'doubleStruck' }
            ];
            
            for (const style of unicodeStyleChecks) {
                if (window.transforms[style.transform] && window.transforms[style.transform].map) {
                    try {
                        // Create reverse mapping
                        const reverseMap = {};
                        for (const [key, value] of Object.entries(window.transforms[style.transform].map)) {
                            reverseMap[value] = key;
                        }
                        
                        // Check if input contains characters from this style
                        const styleChars = Object.values(window.transforms[style.transform].map);
                        const hasStyleChars = styleChars.some(char => input.includes(char));
                        
                        if (hasStyleChars) {
                            // Decode text
                            let result = '';
                            for (const char of input) {
                                result += reverseMap[char] || char;
                            }
                            
                            if (result !== input && /[a-zA-Z0-9]/.test(result)) {
                                return { text: result, method: style.name };
                            }
                        }
                    } catch (e) {
                        console.error(`${style.name} decode error:`, e);
                    }
                }
            }
            
            // - Try reverse each transform that has a built-in reverse function
            for (const name in window.transforms) {
                const transform = window.transforms[name];
                if (transform.reverse) {
                    try {
                        const result = transform.reverse(input);
                        // Only return if the result is different and contains readable characters
                        if (result !== input && /[a-zA-Z0-9\s]{3,}/.test(result)) {
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
            // Always show all emojis - search functionality removed
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            this.renderEmojiGrid();
        },
        
        selectEmoji(emoji) {
            this.selectedEmoji = emoji;
            
            // Create a temporary carrier for this emoji
            const tempCarrier = {
                name: `${emoji} Carrier`,
                emoji: emoji,
                encode: (text) => this.steganography.encode(text, emoji),
                decode: (text) => this.steganography.decode(text),
                preview: (text) => `${emoji}${text}${emoji}`
            };
            
            // Use this emoji as carrier
            this.selectedCarrier = tempCarrier;
            this.activeSteg = 'emoji';
            
            // Encode the message with this emoji
            if (this.emojiMessage) {
                this.autoEncode();
                
                // Wait for encoding to complete, then copy to clipboard
                this.$nextTick(() => {
                    if (this.encodedMessage) {
                        // Force clipboard copy regardless of event source
                        this.forceCopyToClipboard(this.encodedMessage);
                        this.showNotification(`<i class="fas fa-check"></i> Copied hidden message with ${emoji}`, 'success');
                        
                        // Add to copy history
                        this.addToCopyHistory(`Emoji: ${emoji}`, this.encodedMessage);
                    }
                });
            } else {
                this.showNotification(`Select an emoji and enter a message first`, 'info');
            }
        },
        
        renderEmojiGrid() {
            console.log('renderEmojiGrid called with', this.filteredEmojis.length, 'emojis');
            
            // Make sure container exists
            const container = document.getElementById('emoji-grid-container');
            if (!container) {
                console.error('emoji-grid-container not found!');
                return;
            }
            
            // Force container to be completely visible
            container.style.cssText = 'display: block !important; visibility: visible !important; min-height: 300px;';
            
            // Make sure parent containers are visible too
            const emojiLibrary = document.querySelector('.emoji-library');
            if (emojiLibrary) {
                emojiLibrary.style.cssText = 'display: block !important; visibility: visible !important;';
            }
            
            // Clear any existing content to avoid duplication
            container.innerHTML = '';
            
            // Render the emoji grid
            window.emojiLibrary.renderEmojiGrid('emoji-grid-container', this.selectEmoji.bind(this), this.filteredEmojis);
            
            // Message about copying has been removed as requested
            
            // Log success
            console.log('Emoji grid rendered successfully');
        }
    },
    // Initialize theme and components
    mounted() {
        console.log('Vue app mounted');
        // Apply theme
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        // Add smooth scrolling for category navigation
        this.$nextTick(() => {
            const legendItems = document.querySelectorAll('.transform-category-legend .legend-item');
            legendItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.getAttribute('data-target');
                    if (targetId) {
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            // Add active class to the clicked legend item
                            legendItems.forEach(li => li.classList.remove('active-category'));
                            item.classList.add('active-category');
                            
                            // Scroll to the target element with smooth behavior
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });
        });
        
        // Initialize emoji grid with all emojis shown by default
        this.$nextTick(() => {
            console.log('nextTick: Initializing emoji grid');
            // Make sure filtered emojis is populated
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            
            // Define a function to properly initialize the emoji grid
            const initializeEmojiGrid = () => {
                const emojiGridContainer = document.getElementById('emoji-grid-container');
                
                if (emojiGridContainer) {
                    console.log('Found emoji-grid-container, rendering grid');
                    
                    // Set inline styles to ensure visibility
                    emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px; border: 1px solid #ccc;');
                    
                    // Also make sure the parent container is visible
                    const emojiLibrary = document.querySelector('.emoji-library');
                    if (emojiLibrary) {
                        emojiLibrary.setAttribute('style', 'display: block !important; visibility: visible !important; margin-top: 30px; border: 3px solid var(--accent-color); overflow: visible;');
                    }
                    
                    // Now render the grid
                    this.renderEmojiGrid();
                    console.log('Emoji grid rendering complete in mounted()');
                } else {
                    console.error('emoji-grid-container not found, will retry');
                    // Try again after a longer delay if not found
                    setTimeout(initializeEmojiGrid, 500);
                }
            };
            
            // Start with a small delay to ensure DOM is ready
            setTimeout(initializeEmojiGrid, 100);
            
            // Set up paste event handlers for all textareas to prevent unwanted clipboard notifications
            this.setupPasteHandlers();
        });
    },
    
    // Set up paste event handlers for all textareas
    setupPasteHandlers() {
        // Get all textareas in the app
        const textareas = document.querySelectorAll('textarea');
        
        // Add paste event listener to each textarea
        textareas.forEach(textarea => {
            textarea.addEventListener('paste', (e) => {
                // Mark this as an explicit paste event
                this.isPasteOperation = true;
                
                // Reset the flag after a short delay
                setTimeout(() => {
                    this.isPasteOperation = false;
                }, 100);
            });
        });
    },
    // No keyboard shortcuts - they were removed as requested
    created() {
        // Initialize any required functionality
        // But no keyboard shortcuts/hotkeys for now
    },
    
    // Watch for input events and ensure emojis stay visible
    watch: {
        // Make sure emoji list stays loaded when user types in any input
        emojiMessage() {
            // Reset the filtered emojis to the full list whenever typing occurs
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            this.$nextTick(() => {
                this.renderEmojiGrid();
            });
        },
        // Also watch the decode input field for typing activity
        decodeInput() {
            // Always show full emoji list
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            this.$nextTick(() => {
                this.renderEmojiGrid();
            });
        }
    }
});
