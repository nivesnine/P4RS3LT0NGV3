// Initialize Vue app
// Merge tool registry data, methods, watchers, and lifecycle hooks
const baseData = {
    // Theme
    isDarkTheme: true,

    // Tab Management
    activeTab: 'transforms',
    
    // Registered tools for dynamic tab generation (will be populated after tools load)
    registeredTools: [],

    // Universal Decoder Tab
    decoderInput: '',
    decoderOutput: '',
    decoderResult: null,
    selectedDecoder: 'auto',

    // Transform Tab
    transformInput: '',
    transformOutput: '',
    activeTransform: null,
    // Transform categories for styling
    transformCategories: {
        encoding: ['Base64', 'Base64 URL', 'Base32', 'Base45', 'Base58', 'Base62', 'Binary', 'Hexadecimal', 'ASCII85', 'URL Encode', 'HTML Entities'],
        cipher: ['Caesar Cipher', 'ROT13', 'ROT47', 'ROT18', 'ROT5', 'Morse Code', 'Atbash Cipher', 'Vigenère Cipher', 'Affine Cipher (a=5,b=8)', 'Rail Fence (3 Rails)', 'Baconian Cipher', 'Tap Code', 'A1Z26', 'QWERTY Right Shift'],
        visual: ['Rainbow Text', 'Strikethrough', 'Underline', 'Reverse Text', 'Alternating Case', 'Reverse Words', 'Random Case', 'Title Case', 'Sentence Case', 'Emoji Speak', 'Ubbi Dubbi', 'Rövarspråket', 'Vaporwave', 'Disemvowel'],
        format: ['Pig Latin', 'Leetspeak', 'NATO Phonetic', 'camelCase', 'snake_case', 'kebab-case'],
        unicode: ['Invisible Text', 'Upside Down', 'Full Width', 'Small Caps', 'Bubble', 'Braille', 'Greek Letters', 'Wingdings', 'Superscript', 'Subscript', 'Regional Indicator Letters', 'Fraktur', 'Cyrillic Stylized', 'Katakana', 'Hiragana', 'Roman Numerals'],
        special: ['Medieval', 'Cursive', 'Monospace', 'Double-Struck', 'Elder Futhark', 'Mirror Text', 'Zalgo'],
        fantasy: ['Quenya (Tolkien Elvish)', 'Tengwar Script', 'Klingon', 'Aurebesh (Star Wars)', 'Dovahzul (Dragon)'],
        ancient: ['Hieroglyphics', 'Ogham (Celtic)', 'Semaphore Flags'],
        technical: ['Brainfuck', 'Mathematical Notation', 'Chemical Symbols'],
        randomizer: ['Random Mix']
    },
    // Be resilient if transforms fail to load
    transforms: Object.entries(window.transforms || {}).map(([key, transform]) => ({
        name: transform.name,
        func: transform.func.bind(transform),
        preview: transform.preview.bind(transform),
        reverse: transform.reverse ? transform.reverse.bind(transform) : null,
        category: transform.category || 'special' // Preserve category from transformer
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
    lastCopyTime: 0,         // Timestamp of last copy operation for debounce
    ignoreKeyboardEvents: false, // Flag to prevent keyboard events from triggering copies
    isTransformCopy: false,   // Flag to mark transform-initiated copy operations
    keyboardEventsTimeout: null, // Timeout for resetting keyboard event flag
    activeSteg: null,
    carriers: window.steganography ? window.steganography.carriers : [],
    showDecoder: true,
    // Emoji Library
    filteredEmojis: window.emojiLibrary ? [...window.emojiLibrary.EMOJI_LIST] : [],
    selectedEmoji: null,
    carrierEmojiList: window.emojiLibrary ? [...window.emojiLibrary.EMOJI_LIST] : [],
    quickCarrierEmojis: ['🐍','🐉','🐲','🔥','💥','🗿','⚓','⭐','✨','🚀','💀','🪨','🍃','🪶','🔮','🐢','🐊','🦎'],
    tbCarrierManual: '',
    // Token Bomb Generator
    tbDepth: 3,
    tbBreadth: 4,
    tbRepeats: 5,
    tbSeparator: 'zwnj',
    tbIncludeVS: true,
    tbIncludeNoise: true,
    tbRandomizeEmojis: true, // forced on; no UI control
    tbAutoCopy: true,
    tbSingleCarrier: true,
    tbCarrier: '',
    tbPayloadEmojis: [],
    tokenBombOutput: '',
    // Text Payload Generator
    tpBase: '',
    tpRepeat: 100,
    tpCombining: true,
    tpZW: false,
    textPayload: '',
    // Tokenizer tab
    tokenizerInput: '',
    tokenizerEngine: 'byte',
    tokenizerTokens: [],
    tokenizerCharCount: 0,
    tokenizerWordCount: 0,
    
    // Fuzzer
    fuzzerInput: '',
    fuzzerCount: 20,
    fuzzerSeed: '',
    fuzzUseRandomMix: true,
    fuzzZeroWidth: true,
    fuzzUnicodeNoise: true,
    fuzzZalgo: false,
    fuzzWhitespace: true,
    fuzzCasing: true,
    fuzzEncodeShuffle: false,
    fuzzerOutputs: [],

    // Gibberish Dictionary
    gibberishInput: '',
    gibberishOutput: '',
    gibberishSeed: '',
    gibberishDictionary: '',
    gibberishChars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    gibberishMode: 'random',

    // Removal mode properties
    removalSubMode: 'random',
    removalInput: '',
    removalVariations: 10,
    removalMinLetters: 1,
    removalMaxLetters: 3,
    removalSeed: '',
    removalOutputs: [],
    
    removalSpecificInput: '',
    removalCharsToRemove: '',
    removalSpecificOutput: '',

    // Message Splitter Tab
    splitterInput: '',
    splitterMode: 'word', // 'chunk' or 'word' - default to word
    splitterChunkSize: 6,
    splitterWordSplitSide: 'left', // 'left' or 'right' for even-length words
    splitterWordSkip: 0, // number of words to skip between splits
    splitterMinWordLength: 2, // minimum word length to consider for splitting (skip shorter words)
    splitterSplitFirstWord: true, // whether to split the first word (true) or keep it whole (false)
    splitterCopyAsSingleLine: false, // copy as single line (true) or multiline (false)
    splitterTransforms: [''], // array of transform names to apply in sequence (start with one empty slot)
    splitterStartWrap: '',
    splitterEndWrap: '',
    splitMessages: [],

    // History of copied content
    copyHistory: [],
    maxHistoryItems: window.CONFIG.MAX_HISTORY_ITEMS,
    showCopyHistory: false,
    showUnicodePanel: false,
    unicodeApplyBusy: false,
    unicodeApplyFlash: false,

    // Danger zone controls
    showDangerModal: false,
    dangerThresholdTokens: window.CONFIG.DANGER_THRESHOLD_TOKENS
};

// Merge tool registry data
const toolData = (window.toolRegistry && typeof window.toolRegistry.mergeVueData === 'function') 
    ? window.toolRegistry.mergeVueData() 
    : {};
const mergedData = Object.assign({}, baseData, toolData);

// Merge tool registry methods
const toolMethods = (window.toolRegistry && typeof window.toolRegistry.mergeVueMethods === 'function') 
    ? window.toolRegistry.mergeVueMethods() 
    : {};

window.app = new Vue({
    el: '#app',
    data: mergedData,
    methods: Object.assign({}, toolMethods || {}, {
        toggleUnicodePanel() {
            this.showUnicodePanel = !this.showUnicodePanel;
            const panel = document.getElementById('unicode-options-panel');
            if (panel) {
                if (this.showUnicodePanel) panel.classList.add('active');
                else panel.classList.remove('active');
            }
        },
        applyUnicodeOptions() {
            if (this.unicodeApplyBusy) return;
            this.unicodeApplyBusy = true;
            try {
                const initSel = document.querySelector('.steg-initial-presentation');
                const vs0Sel = document.querySelector('.steg-vs-zero');
                const vs1Sel = document.querySelector('.steg-vs-one');
                const zwSel = document.querySelector('.steg-inter-zw');
                const everyInput = document.querySelector('.steg-inter-every');
                const orderSel = document.querySelector('.steg-bit-order');
                const trailSel = document.querySelector('.steg-trailing-zw');

                const parseEsc = (s) => window.EscapeParser.parseEscapeSequence(s);

                if (window.steganography && window.steganography.setStegOptions) {
                    window.steganography.setStegOptions({
                        initialPresentation: (initSel && initSel.value) || 'none',
                        bitZeroVS: parseEsc(vs0Sel && vs0Sel.value) || '\ufe0e',
                        bitOneVS: parseEsc(vs1Sel && vs1Sel.value) || '\ufe0f',
                        interBitZW: parseEsc(zwSel && zwSel.value) || null,
                        interBitEvery: Math.max(1, Math.min(8, Number((everyInput && everyInput.value) || 1))),
                        bitOrder: (orderSel && orderSel.value) || 'msb',
                        trailingZW: parseEsc(trailSel && trailSel.value) || ''
                    });
                    this.unicodeApplyFlash = true;
                    this.showNotification('<i class="fas fa-sliders-h"></i> Advanced settings applied', 'success');
                    setTimeout(()=>{ this.unicodeApplyFlash = false; }, 1200);
                } else {
                    this.showNotification('<i class="fas fa-exclamation-triangle"></i> Engine missing setStegOptions()', 'warning');
                }
            } catch (e) {
                console.error('Apply Unicode options error', e);
                this.showNotification('<i class="fas fa-exclamation-triangle"></i> Failed to apply settings', 'error');
            } finally { this.unicodeApplyBusy = false; }
        },
        // Focus an element without causing the page to scroll
        focusWithoutScroll(el) {
            window.FocusUtils.focusWithoutScroll(el);
        },

        // Trigger randomizer chaos animation regardless of input
        triggerRandomizerChaos() {
            try {
                const section = document.getElementById('category-randomizer');
                const overlay = section && section.querySelector('.chaos-overlay');
                if (!overlay) return;
                const emojis = ['✨','🌀','💥','⚡','🔥','🌈','🎲','🔮','💫','🌪️'];
                for (let i=0;i<10;i++) {
                    const el = document.createElement('div');
                    el.className = 'chaos-particle';
                    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
                    el.style.left = (10 + Math.random()*80) + '%';
                    el.style.fontSize = (14 + Math.random()*10) + 'px';
                    el.style.animationDelay = (Math.random()*0.2) + 's';
                    overlay.appendChild(el);
                    setTimeout(()=>{ if (el.parentNode) el.parentNode.removeChild(el); }, 1300);
                }
                section.classList.add('shake-once','randomizer-glow');
                setTimeout(()=>section && section.classList.remove('shake-once','randomizer-glow'), 600);
            } catch(_) {}
        },
        // Switch between tabs with proper initialization
        switchToTab(tabName) {
            // Deactivate previous tool
            if (this.activeTab && window.toolRegistry) {
                window.toolRegistry.deactivateTool(this.activeTab, this);
            }
            
            this.activeTab = tabName;
            
            // Reset universal decoder input when switching tabs
            this.universalDecodeInput = '';
            this.universalDecodeResult = null;
            
            // Activate new tool via registry
            if (window.toolRegistry) {
                window.toolRegistry.activateTool(tabName, this);
            }
            
            // Legacy initialization (kept for backward compatibility)
            // Initialize emoji grid when switching to steganography tab
            if (tabName === 'steganography') {
                this.$nextTick(() => {
                    const emojiGridContainer = document.getElementById('emoji-grid-container');
                    if (emojiGridContainer) {
                        emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px;');
                        if (this.renderEmojiGrid) {
                            this.renderEmojiGrid();
                        }
                    }
                });
            }
            
            // Initialize category navigation when switching to transforms tab
            if (tabName === 'transforms') {
                this.$nextTick(() => {
                    if (this.initializeCategoryNavigation) {
                        this.initializeCategoryNavigation();
                    }
                });
            }
            if (tabName === 'tokenizer') {
                this.$nextTick(() => {
                    if (this.runTokenizer) {
                        this.runTokenizer();
                    }
                });
            }
        },
        
        // Map transformer names to display categories
        // This maps the actual transform names to the UI display categories
        getDisplayCategory(transformName) {
            const categoryMap = {
                // Encoding category
                'Base64': 'encoding',
                'Base64 URL': 'encoding',
                'Base32': 'encoding',
                'Base45': 'encoding',
                'Base58': 'encoding',
                'Base62': 'encoding',
                'Binary': 'encoding',
                'Hexadecimal': 'encoding',
                'ASCII85': 'encoding',
                'URL Encode': 'encoding',
                'HTML Entities': 'encoding',
                
                // Cipher category
                'Caesar Cipher': 'cipher',
                'ROT13': 'cipher',
                'ROT47': 'cipher',
                'ROT18': 'cipher',
                'ROT5': 'cipher',
                'Morse Code': 'cipher',
                'Atbash Cipher': 'cipher',
                'Vigenère Cipher': 'cipher',
                'Affine Cipher (a=5,b=8)': 'cipher',
                'Rail Fence (3 Rails)': 'cipher',
                'Baconian Cipher': 'cipher',
                'Tap Code': 'cipher',
                'A1Z26': 'cipher',
                'QWERTY Right Shift': 'cipher',
                
                // Visual category
                'Strikethrough': 'visual',
                'Underline': 'visual',
                'Reverse Text': 'visual',
                'Alternating Case': 'visual',
                'Reverse Words': 'visual',
                'Random Case': 'visual',
                'Title Case': 'visual',
                'Sentence Case': 'visual',
                'Emoji Speak': 'visual',
                'Ubbi Dubbi': 'visual',
                'Rövarspråket': 'visual',
                'Vaporwave': 'visual',
                'Disemvowel': 'visual',
                
                // Format category
                'Pig Latin': 'format',
                'Leetspeak': 'format',
                'NATO Phonetic': 'format',
                'camelCase': 'format',
                'snake_case': 'format',
                'kebab-case': 'format',
                
                // Unicode category
                'Invisible Text': 'unicode',
                'Upside Down': 'unicode',
                'Full Width': 'unicode',
                'Small Caps': 'unicode',
                'Bubble': 'unicode',
                'Braille': 'unicode',
                'Greek Letters': 'unicode',
                'Wingdings': 'unicode',
                'Superscript': 'unicode',
                'Subscript': 'unicode',
                'Regional Indicator Letters': 'unicode',
                'Fraktur': 'unicode',
                'Cyrillic Stylized': 'unicode',
                'Katakana': 'unicode',
                'Hiragana': 'unicode',
                'Roman Numerals': 'unicode',
                
                // Special category
                'Medieval': 'special',
                'Cursive': 'special',
                'Monospace': 'special',
                'Double-Struck': 'special',
                'Elder Futhark': 'special',
                'Mirror Text': 'special',
                'Zalgo': 'special',
                
                // Fantasy category
                'Quenya (Tolkien Elvish)': 'fantasy',
                'Tengwar Script': 'fantasy',
                'Klingon': 'fantasy',
                'Aurebesh (Star Wars)': 'fantasy',
                'Dovahzul (Dragon)': 'fantasy',
                
                // Ancient category
                'Hieroglyphics': 'ancient',
                'Ogham (Celtic)': 'ancient',
                'Semaphore Flags': 'ancient',
                
                // Technical category
                'Brainfuck': 'technical',
                'Mathematical Notation': 'technical',
                'Chemical Symbols': 'technical',
                
                // Randomizer category
                'Random Mix': 'randomizer'
            };
            
            return categoryMap[transformName] || 'special';
        },
        
        // Get transforms grouped by display category
        getTransformsByCategory(category) {
            return this.transforms.filter(transform => 
                this.getDisplayCategory(transform.name) === category
            );
        },
        
        // Theme Toggle
        toggleTheme() {
            this.isDarkTheme = window.ThemeUtils.toggleTheme(this.isDarkTheme);
        },
        
        // Copy History Toggle
        toggleCopyHistory() {
            this.showCopyHistory = !this.showCopyHistory;
            
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
        applyTransform(transform, event) {
            // Prevent default button behavior and scrolling
            event && event.preventDefault();
            event && event.stopPropagation();

            // Always trigger chaos animation for Random Mix, even with empty input
            if (transform && transform.name === 'Random Mix') {
                this.triggerRandomizerChaos();
            }

            if (this.transformInput) {
                // Update active transform and apply it
                this.activeTransform = transform;

                if (transform.name === 'Random Mix') {
                    this.transformOutput = window.transforms.randomizer.func(this.transformInput);
                    // Show transform mapping info
                    const transformInfo = window.transforms.randomizer.getLastTransformInfo();
                    if (transformInfo.length > 0) {
                        const transformsList = transformInfo.map(t => t.transformName).join(', ');
                        this.showNotification(`<i class="fas fa-random"></i> Mixed with: ${transformsList}`, 'success');
                    }
                } else {
                    // Apply transform to full text - let the transform handle segmentation if needed
                    this.transformOutput = transform.func(this.transformInput);
                }
                
                // Set flag to mark this as a transform-initiated copy
                this.isTransformCopy = true;
                
                // Force copy the transform output to clipboard
                this.forceCopyToClipboard(this.transformOutput);
                
                // Add to copy history
                this.addToCopyHistory(`Transform: ${transform.name}`, this.transformOutput);
                
                // Enhanced notification for transform and copy (if not randomizer - it has its own notification)
                if (transform.name !== 'Random Mix') {
                    this.showNotification(`<i class="fas fa-check"></i> ${transform.name} applied and copied!`, 'success');
                }
                
                // Remove active state from transform buttons
                document.querySelectorAll('.transform-button').forEach(button => {
                    button.classList.remove('active');
                });
                
                // Keep focus on input and move cursor to end
                const inputBox = document.querySelector('#transform-input');
                if (inputBox) {
                    this.focusWithoutScroll(inputBox);
                    const len = inputBox.value.length;
                    try { inputBox.setSelectionRange(len, len); } catch (_) {}
                }
                
                // Reset flags immediately
                this.isTransformCopy = false;
                this.ignoreKeyboardEvents = false;
            }
        },
        autoTransform() {
            // Only proceed if we're in the transforms tab and have an active transform
            if (this.transformInput && this.activeTransform && this.activeTab === 'transforms') {
                // Handle text with proper Unicode segmentation
                const segments = window.emojiLibrary.splitEmojis(this.transformInput);
                const transformedSegments = segments.map(segment => {
                    // Skip transformation for emojis and complex Unicode characters
                    if (segment.length > 1 || /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(segment)) {
                        return segment;
                    }
                    return this.activeTransform.func(segment);
                });
                
                this.transformOutput = window.emojiLibrary.joinEmojis(transformedSegments);
            }
        },
        
        // Check if a transform has a reverse function
        transformHasReverse(transform) {
            return transform && typeof transform.reverse === 'function';
        },
        
        // Get all transforms that have a reverse function
        getAllTransformsWithReverse() {
            return this.transforms.filter(t => this.transformHasReverse(t));
        },
        
        // Decode text using the specific transform's reverse function
        decodeWithTransform(transform) {
            if (!this.transformInput || !transform || !this.transformHasReverse(transform)) {
                return;
            }
            
            try {
                // Handle text with proper Unicode segmentation
                const segments = window.emojiLibrary.splitEmojis(this.transformInput);
                const decodedSegments = segments.map(segment => {
                    // Skip decoding for emojis and complex Unicode characters
                    if (segment.length > 1 || /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(segment)) {
                        return segment;
                    }
                    return transform.reverse(segment);
                });
                
                const decodedText = window.emojiLibrary.joinEmojis(decodedSegments);
                
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
            window.HistoryUtils.addToHistory(
                this.copyHistory,
                this.maxHistoryItems,
                source,
                content
            );
        },
        
        // Utility Methods
        async copyToClipboard(text) {
            if (!text) return;
            
            // Check clipboard lock - don't proceed if locked
            if (this.clipboardLocked) {
                return;
            }
            
            // Prevent rapid successive copy operations (debounce)
            const now = Date.now();
            if (now - this.lastCopyTime < window.CONFIG.CLIPBOARD_DEBOUNCE_MS) {
                return;
            }
            this.lastCopyTime = now;
            
            // Set clipboard lock immediately
            this.clipboardLocked = true;
            
            // Always try to copy, regardless of event source
            try {
                await navigator.clipboard.writeText(text);
                
                // Show a success notification
                this.showNotification('<i class="fas fa-check"></i> Copied!', 'success');
                
                // Add to history - determine source from active tab or context
                const source = this.activeTab === 'transforms' ? 'Transform' : 'Steganography';
                this.addToCopyHistory(source, text);
                
                // Aggressively clear focus and selections
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
                
                // Clear any text selection
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                
                // Focus body to avoid any specific interactive elements
                document.body.focus();
                
                // Release clipboard lock after a longer delay
                setTimeout(() => {
                    this.clipboardLocked = false;
                }, window.CONFIG.CLIPBOARD_LOCK_TIMEOUT_MS);
            } catch (err) {
                console.warn('Clipboard access not available:', err);
                
                // Try fallback method for copying (textarea method)
                this.fallbackCopy(text);
            }
        },
        
        fallbackCopy(text) {
            try {
                // Check if keyboard events should be ignored
                if (this.ignoreKeyboardEvents && !this.isTransformCopy) {
                    return;
                }
                
                // Reset the transform flag if it was set
                if (this.isTransformCopy) {
                    this.isTransformCopy = false;
                }
                
                // Debounce check
                const now = Date.now();
                if (now - this.lastCopyTime < window.CONFIG.CLIPBOARD_FALLBACK_DEBOUNCE_MS) {
                    return;
                }
                this.lastCopyTime = now;
                
                // Create temporary textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';  // Avoid scrolling to bottom
                textarea.style.left = '-9999px';    // Move offscreen
                textarea.style.top = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                // Try the copy command
                const successful = document.execCommand('copy');
                
                // Show appropriate notification
                if (successful) {
                    this.showNotification('<i class="fas fa-check"></i> Copied!', 'success');
                    
                    // Add to history with context
                    let source = this.activeTab === 'transforms' ? 'Transform' : 'Steganography';
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
                
                // Aggressively clear focus and selection
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
                
                // Clear any text selection
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                
                // Focus on body element
                document.body.focus();
            } catch (err) {
                console.warn('Fallback copy method failed:', err);
                this.showNotification('<i class="fas fa-exclamation-triangle"></i> Copy not supported', 'error');
            }
        },
        
        // Force copy to clipboard regardless of event context
        forceCopyToClipboard(text) {
            if (!text) return;
            
            // Skip copy operations during paste
            if (this.isPasteOperation) {
                this.isPasteOperation = false;
                return;
            }
            
            // Block keyboard-triggered copies unless it's a transform
            if (!this.isTransformCopy && this.ignoreKeyboardEvents) {
                return;
            }
            
            try {
                // Use Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    // For emojis and complex characters, use a more robust approach
                    const processedText = typeof text === 'string' ? text : String(text);
                    
                    // Try to use the newer clipboard API methods if available
                    if (navigator.clipboard.write && processedText.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u)) {
                        const blob = new Blob([processedText], { type: 'text/plain;charset=utf-8' });
                        const clipboardItem = new ClipboardItem({ 'text/plain': blob });
                        navigator.clipboard.write([clipboardItem])
                            .then(() => {
                                if (this.isTransformCopy) {
                                    this.showCopiedPopup();
                                    this.ignoreKeyboardEvents = true;
                                    clearTimeout(this.keyboardEventsTimeout);
                                    this.keyboardEventsTimeout = setTimeout(() => {
                                        this.ignoreKeyboardEvents = false;
                                    }, window.CONFIG.KEYBOARD_EVENTS_TIMEOUT_MS);
                                }
                                this.isTransformCopy = false;
                                const inputBox = document.querySelector('#transform-input');
                                if (inputBox) {
                                    inputBox.focus();
                                    const len = inputBox.value.length;
                                    inputBox.setSelectionRange(len, len);
                                }
                            })
                            .catch(err => {
                                console.warn('Advanced Clipboard API failed:', err);
                                // Fall back to basic writeText
                                navigator.clipboard.writeText(processedText)
                                    .then(() => {
                                        if (this.isTransformCopy) {
                                            this.showCopiedPopup();
                                        }
                                        this.isTransformCopy = false;
                                        const inputBox = document.querySelector('#transform-input');
                                        if (inputBox) {
                                            inputBox.focus();
                                            const len = inputBox.value.length;
                                            inputBox.setSelectionRange(len, len);
                                        }
                                    })
                                    .catch(err => {
                                        console.warn('Basic Clipboard API failed:', err);
                                        this.forceFallbackCopy(processedText);
                                    });
                            });
                    } else {
                        navigator.clipboard.writeText(processedText)
                            .then(() => {
                                if (this.isTransformCopy) {
                                    this.showCopiedPopup();
                                }
                                this.isTransformCopy = false;
                                const inputBox = document.querySelector('#transform-input');
                                if (inputBox) {
                                    inputBox.focus();
                                    const len = inputBox.value.length;
                                    inputBox.setSelectionRange(len, len);
                                }
                            })
                            .catch(err => {
                                console.warn('Basic Clipboard API failed:', err);
                                this.forceFallbackCopy(processedText);
                            });
                    }
                } else {
                    this.forceFallbackCopy(text);
                }
            } catch (error) {
                console.error('Force copy failed:', error);
                this.forceFallbackCopy(text);
            }
        },
        
        // Fallback copy method that doesn't rely on user-initiated events
        forceFallbackCopy(text) {
            try {
                // If clipboard is locked, don't proceed
                if (this.clipboardLocked) {
                    console.log('Fallback copy prevented by clipboard lock');
                    return;
                }
                
                // Set clipboard lock immediately
                this.clipboardLocked = true;
                
                // Create temporary textarea for copying
                const textarea = document.createElement('textarea');
                textarea.value = text;
                
                // Ensure proper emoji rendering
                textarea.style.fontFamily = "'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
                textarea.style.fontSize = '16px';
                
                // Position offscreen but with proper dimensions
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                textarea.style.top = '0';
                textarea.style.width = '100px';
                textarea.style.height = '100px';
                document.body.appendChild(textarea);
                
                // Focus and select the text
                textarea.focus();
                textarea.select();
                
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Force fallback copy command failed:', err);
                }
                
                // Remove the temporary element
                document.body.removeChild(textarea);
                
                // Keep focus on input
                const inputBox = document.querySelector('#transform-input');
                if (inputBox) {
                    inputBox.focus();
                    const len = inputBox.value.length;
                    inputBox.setSelectionRange(len, len);
                }
                
                // Reset flags immediately
                this.clipboardLocked = false;
                this.isTransformCopy = false;
                this.ignoreKeyboardEvents = false;
            } catch (err) {
                console.error('Force fallback copy method failed:', err);
                this.clipboardLocked = false; // Make sure we don't leave it locked in case of error
            }
        },
        
        // Notification system
        showNotification(message, type = 'success') {
            window.NotificationUtils.showNotification(message, type);
        },
        
        // Special prominent copy notification
        showCopiedPopup() {
            window.NotificationUtils.showCopiedPopup();
        },
        
        // Run the universal decoder when input changes
        runUniversalDecode() {
            // Support both the dedicated decoder tab and the legacy universalDecodeInput
            const input = this.activeTab === 'decoder' ? this.decoderInput : this.universalDecodeInput;
            
            // Clear result if input is empty
            if (!input) {
                if (this.activeTab === 'decoder') {
                    this.decoderOutput = '';
                    this.decoderResult = null;
                } else {
                    this.universalDecodeResult = null;
                }
                return;
            }
            
            let result = null;
            
            // If manual decoder is selected, use it directly
            if (this.activeTab === 'decoder' && this.selectedDecoder !== 'auto') {
                const selectedTransform = this.transforms.find(t => t.name === this.selectedDecoder);
                if (selectedTransform && selectedTransform.reverse) {
                    try {
                        const decoded = selectedTransform.reverse(input);
                        if (decoded && decoded !== input) {
                            result = {
                                text: decoded,
                                method: selectedTransform.name,
                                alternatives: []
                            };
                        }
                    } catch (e) {
                        console.error(`Error using manual decoder ${this.selectedDecoder}:`, e);
                    }
                }
            } else {
                // Use the external universal decoder with context for auto-detection
                result = window.universalDecode(input, {
                    activeTab: this.activeTab,
                    activeTransform: this.activeTransform
                });
            }
            
            // Update the result based on which tab we're in
            if (this.activeTab === 'decoder') {
                this.decoderResult = result;
                this.decoderOutput = result ? result.text : '';
            } else {
                this.universalDecodeResult = result;
            }
            
        },
        
        // Use an alternative decoding from the decoder tab
        useAlternative(alternative) {
            if (alternative && alternative.text) {
                this.decoderOutput = alternative.text;
                // Update the result to show this alternative as primary
                this.decoderResult = {
                    method: alternative.method,
                    text: alternative.text,
                    alternatives: this.decoderResult.alternatives.filter(a => a.method !== alternative.method)
                };
            }
        },
        
        // NOTE: Universal Decoder moved to js/decoder.js for better organization
        // Now accessed via window.universalDecode(input, context)
        
        // Emoji Library Methods
        filterEmojis() {
            // Always show all emojis - search functionality removed
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            this.renderEmojiGrid();
        },
        
        selectEmoji(emoji) {
            // Directly copy the emoji to clipboard - ensure it's a string
            const emojiStr = String(emoji);
            
            // Special handling for emoji characters
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emojiStr)
                    .then(() => {
                        this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                        this.addToCopyHistory('Emoji', emojiStr);
                    })
                    .catch(err => {
                        console.warn('Emoji clipboard API failed:', err);
                        // Fallback to our custom method
                        this.forceCopyToClipboard(emojiStr);
                        this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                        this.addToCopyHistory('Emoji', emojiStr);
                    });
            } else {
                // Use our custom method if Clipboard API not available
                this.forceCopyToClipboard(emojiStr);
                this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                this.addToCopyHistory('Emoji', emojiStr);
            }
            
            // Also set up carrier if we're in steganography mode
            if (this.activeTab === 'steganography') {
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
                
                // Encode the message with this emoji if we have one
                if (this.emojiMessage) {
                    this.autoEncode();
                    
                    // Wait for encoding to complete, then copy to clipboard
                    this.$nextTick(() => {
                        if (this.encodedMessage) {
                            const encodedStr = String(this.encodedMessage);
                            
                            // Use native clipboard API first for better emoji support
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(encodedStr)
                                    .then(() => {
                                        this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                        this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                                    })
                                    .catch(err => {
                                        console.warn('Encoded emoji clipboard API failed:', err);
                                        // Fall back to our custom method
                                        this.forceCopyToClipboard(encodedStr);
                                        this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                        this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                                    });
                            } else {
                                // Use our custom method if Clipboard API not available
                                this.forceCopyToClipboard(encodedStr);
                                this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                            }
                        }
                    });
                }
            }
        },
        
        renderEmojiGrid() {
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
        },
        
        // Initialize category navigation for transform sections
        initializeCategoryNavigation() {
            this.$nextTick(() => {
                const legendItems = document.querySelectorAll('.transform-category-legend .legend-item');
                
                // First, remove any existing event listeners to prevent duplicates
                legendItems.forEach(item => {
                    const newItem = item.cloneNode(true);
                    item.parentNode.replaceChild(newItem, item);
                });
                
                // Now add event listeners to the fresh elements
                document.querySelectorAll('.transform-category-legend .legend-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const targetId = item.getAttribute('data-target');
                        if (targetId) {
                            const targetElement = document.getElementById(targetId);
                            if (targetElement) {
                                // Add active class to the clicked legend item
                                document.querySelectorAll('.transform-category-legend .legend-item').forEach(li => {
                                    li.classList.remove('active-category');
                                });
                                item.classList.add('active-category');
                                
                                // Get height of .input-section so we can offset the scroll
                                const inputSection = document.querySelector('.input-section');
                                const inputSectionHeight = inputSection.offsetHeight;
                                
                                // Calculate the target scroll position with offset
                                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                const offsetPosition = elementPosition - inputSectionHeight - 10; // Extra 10px padding
                                
                                // Scroll to the calculated position
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                                
                                // Highlight the section briefly to draw attention
                                targetElement.classList.add('highlight-section');
                                setTimeout(() => {
                                    targetElement.classList.remove('highlight-section');
                                }, 1000);
                            }
                        }
                    });
                });
            });
        }
        ,
        // -------- Fuzzer --------
        seededRandomFactory(seedStr) {
            if (!seedStr) return Math.random;
            let h = 1779033703 ^ seedStr.length;
            for (let i=0;i<seedStr.length;i++) {
                h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
                h = (h << 13) | (h >>> 19);
            }
            return function() {
                h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16;
                return (h >>> 0) / 4294967296;
            };
        },
        pick(arr, rnd) { return arr[Math.floor(rnd()*arr.length)]; },
        injectZeroWidth(text, rnd) {
            const zw = ['\u200B','\u200C','\u200D','\u2060'];
            return [...text].map(ch => (rnd()<0.2 ? ch+this.pick(zw,rnd) : ch)).join('');
        },
        injectUnicodeNoise(text, rnd) {
            const marks = ['\u0301','\u0300','\u0302','\u0303','\u0308','\u0307','\u0304'];
            return [...text].map(ch => (rnd()<0.15 ? ch+this.pick(marks,rnd) : ch)).join('');
        },
        whitespaceChaos(text, rnd) {
            return text.replace(/\s/g, (m)=> (rnd()<0.5? m : (rnd()<0.5?'\t':'\u00A0')));
        },
        casingChaos(text, rnd) {
            return [...text].map(c => /[a-z]/i.test(c)? (rnd()<0.5? c.toUpperCase():c.toLowerCase()) : c).join('');
        },
        // Replace encodeShuffle with homoglyph confusables injection
        encodeShuffle(text, rnd) {
            const map = {
                'A':'Α','B':'Β','C':'Ϲ','E':'Ε','H':'Η','I':'Ι','K':'Κ','M':'Μ','N':'Ν','O':'Ο','P':'Ρ','T':'Τ','X':'Χ','Y':'Υ',
                'a':'а','c':'с','e':'е','i':'і','j':'ј','o':'о','p':'р','s':'ѕ','x':'х','y':'у'
            };
            return [...text].map(ch => {
                if (map[ch] && rnd() < 0.25) return map[ch];
                return ch;
            }).join('');
        },
        generateFuzzCases() {
            const src = String(this.fuzzerInput || '');
            if (!src) { this.fuzzerOutputs = []; return; }
            const rnd = this.seededRandomFactory(String(this.fuzzerSeed||''));
            const out = [];
            for (let i=0;i<Math.max(1,Math.min(500,Number(this.fuzzerCount)||1)); i++) {
                let s = src;
                if (this.fuzzUseRandomMix) {
                    try { s = window.transforms.randomizer.func(s, { minTransforms:2, maxTransforms:4 }); } catch(_) {}
                }
                if (this.fuzzZeroWidth) s = this.injectZeroWidth(s, rnd);
                if (this.fuzzUnicodeNoise) s = this.injectUnicodeNoise(s, rnd);
                if (this.fuzzWhitespace) s = this.whitespaceChaos(s, rnd);
                if (this.fuzzCasing) s = this.casingChaos(s, rnd);
                if (this.fuzzZalgo) { try { s = window.transforms.zalgo.func(s); } catch(_) {} }
                if (this.fuzzEncodeShuffle) s = this.encodeShuffle(s, rnd);
                out.push(s);
            }
            this.fuzzerOutputs = out;
        },
        copyAllFuzz() { this.copyToClipboard(this.fuzzerOutputs.join('\n')); },
        downloadFuzz() {
            const lines = this.fuzzerOutputs.map((s, i) => `#${i+1}\t${s}`).join('\n');
            const header = `# Parseltongue Fuzzer Output\n# count=${this.fuzzerOutputs.length}\n# seed=${this.fuzzerSeed || ''}\n# strategies=${[
                this.fuzzUseRandomMix?'randomMix':null,
                this.fuzzZeroWidth?'zeroWidth':null,
                this.fuzzUnicodeNoise?'unicodeNoise':null,
                this.fuzzWhitespace?'whitespace':null,
                this.fuzzCasing?'casing':null,
                this.fuzzZalgo?'zalgo':null,
                this.fuzzEncodeShuffle?'encodeShuffle':null
            ].filter(Boolean).join(',')}\n`;
            const blob = new Blob([header + lines + '\n'], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'fuzz_cases.txt'; a.click();
            setTimeout(()=>URL.revokeObjectURL(url), 200);
        },

        // Message Splitter Methods
        /**
         * Set encapsulation start and end strings
         * @param {string} start - The start string
         * @param {string} end - The end string
         */
        setEncapsulation(start, end) {
            this.splitterStartWrap = start;
            this.splitterEndWrap = end;
        },

        /**
         * Toggle tooltip visibility on click
         * @param {Event} event - The click event
         */
        toggleTooltip(event) {
            event.stopPropagation();
            
            const icon = event.currentTarget;
            const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
            let tooltip = document.querySelector(`.custom-tooltip[data-for="${icon.dataset.tooltipId || tooltipId}"]`);
            const isCurrentlyActive = tooltip && tooltip.classList.contains('active');
            
            // Close all tooltips first
            document.querySelectorAll('.custom-tooltip.active').forEach(t => {
                t.classList.remove('active');
                setTimeout(() => {
                    if (!t.classList.contains('active')) {
                        t.remove();
                    }
                }, 200);
            });
            
            // If this tooltip wasn't active, open it
            if (!isCurrentlyActive) {
                const tooltipText = icon.getAttribute('data-tooltip');
                if (tooltipText) {
                    // Store tooltip ID on icon for future reference
                    if (!icon.dataset.tooltipId) {
                        icon.dataset.tooltipId = tooltipId;
                    }
                    
                    // Create tooltip and append to body for better positioning
                    tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    tooltip.textContent = tooltipText;
                    tooltip.setAttribute('data-for', icon.dataset.tooltipId);
                    document.body.appendChild(tooltip);
                    
                    // Position the tooltip relative to the icon
                    const iconRect = icon.getBoundingClientRect();
                    tooltip.style.position = 'fixed';
                    tooltip.style.left = (iconRect.left + iconRect.width / 2) + 'px';
                    tooltip.style.top = (iconRect.top - 8) + 'px';
                    tooltip.style.transform = 'translate(-50%, -100%)';
                    
                    // Force reflow to ensure transition works
                    void tooltip.offsetHeight;
                    
                    // Use setTimeout to ensure the element is in the DOM before adding active class
                    setTimeout(() => {
                        tooltip.classList.add('active');
                    }, 10);
                }
            }
        },

        /**
         * Handle transform change - auto-add next dropdown or collapse consecutive Nones
         * @param {number} index - The index of the transformation that changed
         */
        handleTransformChange(index) {
            const value = this.splitterTransforms[index];
            
            if (value && value !== '') {
                // Transform was selected - add next dropdown if it doesn't exist
                if (index === this.splitterTransforms.length - 1) {
                    this.splitterTransforms.push('');
                }
            } else {
                // Transform was set to None
                // Check if previous dropdown is also None - if so, remove current one and collapse from previous position
                if (index > 0) {
                    const prevValue = this.splitterTransforms[index - 1];
                    if (!prevValue || prevValue === '') {
                        // Previous one is also None, remove current one
                        this.splitterTransforms.splice(index, 1);
                        // Now collapse trailing Nones from the previous position
                        index = index - 1;
                    }
                }
                
                // Remove all consecutive trailing Nones
                // Keep removing the next dropdown if it's also None
                while (index + 1 < this.splitterTransforms.length) {
                    const nextValue = this.splitterTransforms[index + 1];
                    if (!nextValue || nextValue === '') {
                        // Next one is also None, remove it
                        this.splitterTransforms.splice(index + 1, 1);
                    } else {
                        // Next one has a value, stop removing
                        break;
                    }
                }
            }
        },

        /**
         * Remove a transformation at the given index
         * @param {number} index - The index of the transformation to remove
         */
        removeTransform(index) {
            if (this.splitterTransforms.length > 1) {
                this.splitterTransforms.splice(index, 1);
            } else {
                // If it's the last one, just clear it instead of removing
                this.splitterTransforms[0] = '';
            }
        },

        /**
         * Generate split messages from input text
         * Supports two modes: character chunks or split words in half
         */
        generateSplitMessages() {
            // Clear previous output at the start
            this.splitMessages = [];

            const input = this.splitterInput;
            if (!input) {
                return;
            }

            let chunks = [];

            if (this.splitterMode === 'chunk') {
                // Character chunk mode
                const chunkSize = Math.max(1, Math.min(500, this.splitterChunkSize || 6));
                for (let i = 0; i < input.length; i += chunkSize) {
                    chunks.push(input.slice(i, i + chunkSize));
                }
            } else if (this.splitterMode === 'word') {
                // Word split mode - creates messages with pattern: secondHalf + wholeWords + firstHalf
                // IMPORTANT: ALL words must be included in output, never filtered out
                const words = input.match(/\S+/g) || [];
                if (words.length === 0) return;
                
                const skipCount = Math.max(0, Math.min(20, this.splitterWordSkip || 0));
                const minLength = Math.max(1, this.splitterMinWordLength || 2);
                
                // Process all words - only split words that meet minimum length
                // Short words are kept whole but still included in the pattern
                let wordsToProcess = words;
                let prependToFirst = [];
                
                // Handle "Split First Word" option
                if (!this.splitterSplitFirstWord && words.length > 0) {
                    prependToFirst = [words[0]];
                    wordsToProcess = words.slice(1);
                }

                // Build word processing array - track which words can be split vs kept whole
                const wordData = wordsToProcess.map((word, idx) => {
                    const canSplit = word.length >= minLength && word.length > 1;
                    return {
                        word: word,
                        canSplit: canSplit,
                        index: idx
                    };
                });

                // Determine which words to split (only words that can be split)
                const splittableWords = wordData.filter(w => w.canSplit);
                if (splittableWords.length === 0) {
                    // No words can be split, output everything as one message
                    chunks.push([...prependToFirst, ...wordsToProcess].join(' '));
                    return;
                }

                // Determine split pattern based on splittable words only
                const splitIndexes = new Set();
                for (let i = 0; i < splittableWords.length; i++) {
                    if ((i % (skipCount + 1)) === 0) {
                        splitIndexes.add(splittableWords[i].index);
                    }
                }

                // Process all words and build split structure
                const processedWords = wordData.map((wd, idx) => {
                    if (splitIndexes.has(idx) && wd.canSplit) {
                        // Split this word
                        let splitPos;
                        if (wd.word.length % 2 === 0) {
                            splitPos = wd.word.length / 2;
                        } else {
                            splitPos = this.splitterWordSplitSide === 'left' 
                                ? Math.ceil(wd.word.length / 2) 
                                : Math.floor(wd.word.length / 2);
                        }
                        return {
                            firstHalf: wd.word.slice(0, splitPos),
                            secondHalf: wd.word.slice(splitPos),
                            split: true
                        };
                    }
                    // Keep whole (either too short or skipped)
                    return { whole: wd.word, split: false };
                });

                // Build output messages
                let currentMessage = [...prependToFirst];
                let messageStarted = false;

                for (let i = 0; i < processedWords.length; i++) {
                    const item = processedWords[i];
                    
                    if (item.split) {
                        if (!messageStarted) {
                            // First split word - add first half to current message
                            currentMessage.push(item.firstHalf);
                            chunks.push(currentMessage.join(' '));
                            currentMessage = [item.secondHalf];
                            messageStarted = true;
                        } else {
                            // Add first half to current message, then start new message with second half
                            currentMessage.push(item.firstHalf);
                            chunks.push(currentMessage.join(' '));
                            currentMessage = [item.secondHalf];
                        }
                    } else {
                        // Whole word - add to current message (ALL words included)
                        currentMessage.push(item.whole);
                    }
                }

                // Add any remaining message
                if (currentMessage.length > 0) {
                    chunks.push(currentMessage.join(' '));
                }
            }

            // Apply transformations in sequence (chaining)
            let processedChunks = chunks;
            if (this.splitterTransforms && this.splitterTransforms.length > 0) {
                // Filter out empty transforms
                const activeTransforms = this.splitterTransforms.filter(t => t && t !== '');
                
                if (activeTransforms.length > 0) {
                    // Apply each transformation in sequence
                    for (const transformName of activeTransforms) {
                        const selectedTransform = this.transforms.find(t => t.name === transformName);
                        if (selectedTransform && selectedTransform.func) {
                            processedChunks = processedChunks.map(chunk => {
                                try {
                                    return selectedTransform.func(chunk);
                                } catch (e) {
                                    console.error('Transform error:', e);
                                    return chunk;
                                }
                            });
                        }
                    }
                }
            }

            // Apply encapsulation
            const start = this.splitterStartWrap || '';
            const end = this.splitterEndWrap || '';
            this.splitMessages = processedChunks.map(chunk => `${start}${chunk}${end}`);
        },

        /**
         * Copy all split messages to clipboard
         * Single line: merges messages into one continuous string (keeps encapsulation/transformations)
         * Multiline: copies messages separated by newlines
         */
        copyAllSplitMessages() {
            if (this.splitMessages.length === 0) return;
            
            if (this.splitterCopyAsSingleLine) {
                // Merge all messages back together, keeping encapsulation and transformations
                // Just join without newlines - all encapsulation/transformations are already in splitMessages
                const merged = this.splitMessages.join('');
                this.copyToClipboard(merged);
            } else {
                // Copy all messages separated by newlines
                const allMessages = this.splitMessages.join('\n');
                this.copyToClipboard(allMessages);
            }
        },
        // Quick estimate of token count for Tokenade
        estimateTokenadeTokens() {
            // Roughly approximate tokens by estimated character length
            // This intentionally errs on the conservative side for warning purposes
            const approx = this.estimateTokenadeLength();
            return Math.max(0, approx);
        },

        // Confirm danger threshold before generating
        checkTokenadeDangerThenGenerate() {
            const estTokens = this.estimateTokenadeTokens();
            if (estTokens > this.dangerThresholdTokens) {
                this.showDangerModal = true;
                return;
            }
            this.generateTokenBomb();
        },

        // Modal acknowledge handler
        proceedDangerAction() {
            // Close modal and return focus to Generate button for accessibility
            this.showDangerModal = false;
            this.$nextTick(() => {
                try {
                    const btn = document.querySelector('.token-bomb-actions .transform-button');
                    btn && btn.focus();
                } catch (_) {}
            });
        },

        // Token Bomb Generator Logic
        generateTokenBomb() {
            const depth = Math.max(1, Math.min(8, Number(this.tbDepth) || 1));
            const breadth = Math.max(1, Math.min(10, Number(this.tbBreadth) || 1));
            const repeats = Math.max(1, Math.min(50, Number(this.tbRepeats) || 1));
            const sep = this.tbSeparator === 'zwj' ? '\u200D' : this.tbSeparator === 'zwnj' ? '\u200C' : this.tbSeparator === 'zwsp' ? '\u200B' : '';
            const includeVS = !!this.tbIncludeVS;
            const includeNoise = !!this.tbIncludeNoise;
            const randomize = !!this.tbRandomizeEmojis;

            const emojiList = this.filteredEmojis && this.filteredEmojis.length ? this.filteredEmojis : window.emojiLibrary.EMOJI_LIST;

            function pickEmojis(count) {
                const out = [];
                for (let i = 0; i < count; i++) {
                    const idx = randomize ? Math.floor(Math.random() * emojiList.length) : (i % emojiList.length);
                    out.push(String(emojiList[idx]));
                }
                return out;
            }

            function addVS(str) {
                if (!includeVS) return str;
                // Alternate VS16/VS15 to maximize tokenization churn
                const vs16 = '\uFE0F';
                const vs15 = '\uFE0E';
                let out = '';
                for (let i = 0; i < str.length; i++) {
                    const ch = str[i];
                    out += ch + (i % 2 === 0 ? vs16 : vs15);
                }
                return out;
            }

            function noise() {
                if (!includeNoise) return '';
                const parts = ['\u200B','\u200C','\u200D','\u2060','\u2062','\u2063'];
                let s = '';
                const n = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < n; i++) s += parts[Math.floor(Math.random() * parts.length)];
                return s;
            }

            function buildLevel(level) {
                if (level === 0) {
                    const base = pickEmojis(breadth).join('');
                    return addVS(base);
                }
                const items = [];
                for (let i = 0; i < breadth; i++) {
                    const inner = buildLevel(level - 1);
                    items.push(inner + noise());
                }
                return items.join(sep);
            }

            if (this.tbSingleCarrier) {
                const manual = (this.tbCarrierManual || '').trim();
                const carrier = manual || (this.tbCarrier && String(this.tbCarrier)) || (this.selectedEmoji ? String(this.selectedEmoji) : '💥');
                function countUnits(level) {
                    if (level === 0) return breadth;
                    return breadth * countUnits(level - 1);
                }
                const unitsPerBlock = countUnits(depth - 1);
                const totalUnits = Math.max(1, repeats * unitsPerBlock);

                let payload = [];
                payload = pickEmojis(totalUnits);

                function toTagSeqForEmojiChar(ch) {
                    const cp = ch.codePointAt(0);
                    const hex = cp.toString(16);
                    let seq = '';
                    for (const d of hex) {
                        if (d >= '0' && d <= '9') {
                            const base = 0xE0030 + (d.charCodeAt(0) - '0'.charCodeAt(0));
                            seq += String.fromCodePoint(base);
                        } else {
                            const base = 0xE0061 + (d.charCodeAt(0) - 'a'.charCodeAt(0));
                            seq += String.fromCodePoint(base);
                        }
                    }
                    seq += String.fromCodePoint(0xE007F);
                    return seq;
                }

                const vs16 = includeVS ? '\uFE0F' : '';
                let out = carrier + vs16;
                for (let i = 0; i < payload.length; i++) {
                    out += sep + toTagSeqForEmojiChar(payload[i]) + noise();
                }
                this.tokenBombOutput = out;
            } else {
                let block = buildLevel(depth - 1);
                // Repeat the block to increase token length
                const blocks = [];
                for (let i = 0; i < repeats; i++) {
                    blocks.push(block + noise());
                }
                this.tokenBombOutput = blocks.join(sep);
            }

            // Provide a quick visual confirmation
            this.showNotification('<i class="fas fa-bomb"></i> Tokenade generated', 'success');

            if (this.tbAutoCopy && this.tokenBombOutput) {
                this.$nextTick(() => this.copyToClipboard(this.tokenBombOutput));
            }
        },

        applyTokenadePreset(preset) {
            if (preset === 'feather') {
                this.tbDepth = 1; this.tbBreadth = 3; this.tbRepeats = 2; this.tbSeparator = 'zwnj';
                this.tbIncludeVS = false; this.tbIncludeNoise = false; this.tbRandomizeEmojis = true;
            } else if (preset === 'light') {
                this.tbDepth = 2; this.tbBreadth = 3; this.tbRepeats = 3; this.tbSeparator = 'zwnj';
                this.tbIncludeVS = false; this.tbIncludeNoise = true; this.tbRandomizeEmojis = true;
            } else if (preset === 'middle') {
                this.tbDepth = 3; this.tbBreadth = 4; this.tbRepeats = 6; this.tbSeparator = 'zwnj';
                this.tbIncludeVS = true; this.tbIncludeNoise = true; this.tbRandomizeEmojis = true;
            } else if (preset === 'heavy') {
                this.tbDepth = 4; this.tbBreadth = 6; this.tbRepeats = 12; this.tbSeparator = 'zwnj';
                this.tbIncludeVS = true; this.tbIncludeNoise = true; this.tbRandomizeEmojis = true;
            } else if (preset === 'super') {
                this.tbDepth = 5; this.tbBreadth = 8; this.tbRepeats = 18; this.tbSeparator = 'zwnj';
                this.tbIncludeVS = true; this.tbIncludeNoise = true; this.tbRandomizeEmojis = true;
            }
            this.showNotification('<i class="fas fa-sliders-h"></i> Preset applied', 'success');
        },

        // Live estimator for pre-generation length
        estimateTokenadeLength() {
            const depth = Math.max(1, Math.min(8, Number(this.tbDepth) || 1));
            const breadth = Math.max(1, Math.min(10, Number(this.tbBreadth) || 1));
            const repeats = Math.max(1, Math.min(50, Number(this.tbRepeats) || 1));
            const sepLen = this.tbSeparator === 'none' ? 0 : 1;
            const vsPerEmoji = this.tbIncludeVS ? 1 : 0;
            const noiseAvg = this.tbIncludeNoise ? 2 : 0;

            function lenLevel(level) {
                if (level === 0) {
                    return breadth * (1 + vsPerEmoji);
                }
                const inner = lenLevel(level - 1);
                return breadth * (inner + noiseAvg) + Math.max(0, breadth - 1) * sepLen;
            }

            if (this.tbSingleCarrier) {
                function countUnits(level) { return level === 0 ? breadth : breadth * countUnits(level - 1); }
                const unitsPerBlock = countUnits(depth - 1);
                const totalUnits = Math.max(1, repeats * unitsPerBlock);
                const avgDigits = 5; // avg hex digits in tag sequence
                const perUnit = avgDigits + 1 + sepLen + (this.tbIncludeNoise ? 2 : 0); // tags+term + sep + noise
                const carrierLen = 1 + (this.tbIncludeVS ? 1 : 0);
                return carrierLen + totalUnits * perUnit;
            } else {
                const blockLen = lenLevel(depth - 1);
                return repeats * (blockLen + noiseAvg) + Math.max(0, repeats - 1) * sepLen;
            }
        },

        setCarrierFromSelected() {
            if (this.selectedEmoji) this.tbCarrier = String(this.selectedEmoji);
        },
        clearTokenadePayload() { this.tbPayloadEmojis = []; },
        removeTokenadePayloadAt(idx) { this.tbPayloadEmojis.splice(idx, 1); },
        onCarrierInput() {
            const q = (this.tbCarrier || '').trim();
            if (!q) {
                this.carrierEmojiList = [...window.emojiLibrary.EMOJI_LIST];
                return;
            }
            // Filter emoji list by simple name guess or by including the character; if q contains an emoji, keep it
            const list = window.emojiLibrary.EMOJI_LIST;
            const byChar = list.filter(e => e.includes(q));
            // Also support colon-like query (e.g., ':heart') by rough keywords
            const keywords = {
                heart: ['❤️','💛','💚','💙','💜','💖','💘','💝','💗'],
                star: ['⭐','🌟'],
                fire: ['🔥'],
                bomb: ['💣'],
                snake: ['🐍'],
                dragon: ['🐉','🐲'],
                skull: ['💀'],
                sparkles: ['✨'],
                moon: ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙']
            };
            let byKey = [];
            const qk = q.replace(/[:_\s]/g,'').toLowerCase();
            Object.keys(keywords).forEach(k => {
                if (k.indexOf(qk) !== -1) byKey = byKey.concat(keywords[k]);
            });
            const merged = Array.from(new Set([...byChar, ...byKey]));
            this.carrierEmojiList = merged.length ? merged : [...window.emojiLibrary.EMOJI_LIST];
        },
        handleTokenadeDrop(e) {
            e.preventDefault();
            const text = e.dataTransfer && (e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text'));
            if (!text) return;
            const parts = window.emojiLibrary.splitEmojis(text);
            const onlyEmojis = parts.filter(p => /\p{Extended_Pictographic}/u.test(p));
            this.tbPayloadEmojis.push(...onlyEmojis);
        },
        handleTokenadePaste(e) {
            const text = (e.clipboardData && e.clipboardData.getData('text')) || '';
            if (!text) return;
            const parts = window.emojiLibrary.splitEmojis(text);
            const onlyEmojis = parts.filter(p => /\p{Extended_Pictographic}/u.test(p));
            this.tbPayloadEmojis.push(...onlyEmojis);
        }
        ,
        // Tokenizer visualization
        async runTokenizer() {
            const text = this.tokenizerInput || '';
            const engine = this.tokenizerEngine;
            const tokens = [];
            if (!text) { this.tokenizerTokens = []; this.tokenizerCharCount = 0; this.tokenizerWordCount = 0; return; }
            if (engine === 'byte') {
                // Split into UTF-8 bytes, display hex and glyphs
                const encoder = new TextEncoder();
                const bytes = encoder.encode(text);
                for (let i=0;i<bytes.length;i++) {
                    tokens.push({ id: bytes[i], text: `0x${bytes[i].toString(16).padStart(2,'0')}` });
                }
            } else if (engine === 'word') {
                // Naive word split incl. punctuation
                const parts = text.split(/(\s+|[\.,!?:;()\[\]{}])/);
                for (const p of parts) { if (p) tokens.push({ text: p }); }
            } else if (['cl100k','o200k','p50k','r50k'].includes(engine)) {
                try {
                    if (!window.gptTok) {
                        window.gptTok = await import('https://cdn.jsdelivr.net/npm/gpt-tokenizer@2/+esm');
                    }
                    const map = { cl100k: 'cl100k_base', o200k: 'o200k_base', p50k: 'p50k_base', r50k: 'r50k_base' };
                    const enc = map[engine];
                    const ids = window.gptTok.encode(text, enc);
                    for (const id of ids) {
                        const piece = window.gptTok.decode([id], enc);
                        tokens.push({ id, text: piece });
                    }
                } catch (e) {
                    console.warn('Failed to load/use gpt-tokenizer; falling back to bytes', e);
                    this.tokenizerEngine = 'byte';
                    return this.runTokenizer();
                }
            } else {
                // Fallback to bytes
                const encoder = new TextEncoder();
                const bytes = encoder.encode(text);
                for (let i=0;i<bytes.length;i++) tokens.push({ id: bytes[i], text: `0x${bytes[i].toString(16).padStart(2,'0')}` });
            }
            this.tokenizerTokens = tokens;
            // Counts
            this.tokenizerCharCount = Array.from(text).length;
            const wordMatches = text.trim().match(/[^\s]+/g) || [];
            this.tokenizerWordCount = wordMatches.length;
        }
        ,
        generateTextPayload() {
            const base = String(this.tpBase || 'A');
            const count = Math.max(1, Math.min(10000, Number(this.tpRepeat) || 1));
            const combining = this.tpCombining;
            const addZW = this.tpZW;
            const marks = ['\u0301','\u0300','\u0302','\u0303','\u0308','\u0307','\u0304'];
            const zw = ['\u200B','\u200C','\u200D','\u2060'];
            let out = '';
            for (let i=0;i<count;i++) {
                let token = base;
                if (combining) {
                    const m = marks[i % marks.length];
                    token += m;
                }
                if (addZW) {
                    const z = zw[i % zw.length];
                    token += z;
                }
                out += token;
            }
            this.textPayload = out;
            this.showNotification('<i class="fas fa-bomb"></i> Text payload generated', 'success');
        },

        // Gibberish Logic
        seededRandom(seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        },

        sentenceToGibberish() {
        function generateGibberish(word, seed) {
            const length = Math.max(4, word.length);
            let gibberish = "";
            const chars = this.gibberishChars;

            for (let i = 0; i < length; i++) {
            const randomValue = this.seededRandom(seed + i * 0.1);
            gibberish += chars[Math.floor(randomValue * chars.length)];
            }
            return gibberish;
        }
        const src = String(this.gibberishInput || '');
        if (!src) { this.gibberishOutput = ''; return; }

        const words = this.gibberishInput.match(/\b\w+\b/g) || [];
        const dictionary = {};
        let gibberishSentence = "";
        let wordIndex = 0;

        words.forEach((word) => {
            const lowerWord = word.toLowerCase();
            const seed =
            this.gibberishSeed === ""
                ? Math.random() * 100
                : Number(this.gibberishSeed);

            if (!dictionary[lowerWord]) {
            const wordSeed = seed + wordIndex * 100;
            dictionary[lowerWord] = generateGibberish.call(this, word, wordSeed);
            wordIndex++;
            }
        });

        let charIndex = 0;
        for (let i = 0; i < this.gibberishInput.length; i++) {
            const char = this.gibberishInput[i];

            if (/\w/.test(char)) {
            let j = i;
            while (
                j < this.gibberishInput.length &&
                /\w/.test(this.gibberishInput[j])
            ) {
                j++;
            }

            const word = this.gibberishInput.substring(i, j).toLowerCase();
            gibberishSentence += dictionary[word];
            i = j - 1;
            } else {
            gibberishSentence += char;
            }
        }

        const dictionaryString = Object.entries(dictionary)
            .map(([plain, gib]) => `"${plain}": "${gib}"`)
            .join(", ");

        this.gibberishOutput = gibberishSentence;
        this.gibberishDictionary = '{' + dictionaryString + '}';
        },

        
        generateRandomRemovals() {
            if (!this.removalInput.trim()) {
                this.showNotification('Please enter text to process', 'error');
                return;
            }
            
            const seed = this.removalSeed ? String(this.removalSeed) : String(Date.now());
            let rng = this.seededRandomFactory(seed);
            
            this.removalOutputs = [];
            const words = this.removalInput.split(/\s+/);
            
            for (let v = 0; v < this.removalVariations; v++) {
                const modifiedWords = words.map(word => {
                    // Skip very short words or non-alphabetic
                    if (word.length <= 1 || !/[a-zA-Z]/.test(word)) {
                        return word;
                    }
                    
                    // Determine how many letters to remove for this word
                    const minRemove = Math.max(0, this.removalMinLetters);
                    const maxRemove = Math.min(word.length - 1, this.removalMaxLetters);
                    const numToRemove = minRemove + Math.floor(rng() * (maxRemove - minRemove + 1));
                    
                    if (numToRemove === 0) {
                        return word;
                    }
                    
                    // Get letter positions
                    const letters = word.split('').map((c, i) => ({ char: c, index: i }))
                        .filter(item => /[a-zA-Z]/.test(item.char));
                    
                    // Randomly select positions to remove
                    const toRemoveIndices = new Set();
                    const maxAttempts = numToRemove * 3;
                    let attempts = 0;
                    
                    while (toRemoveIndices.size < Math.min(numToRemove, letters.length) && attempts < maxAttempts) {
                        const randIdx = Math.floor(rng() * letters.length);
                        toRemoveIndices.add(letters[randIdx].index);
                        attempts++;
                    }
                    
                    // Build result by skipping removed indices
                    return word.split('').filter((_, i) => !toRemoveIndices.has(i)).join('');
                });
                
                this.removalOutputs.push(modifiedWords.join(' '));
            }
            
            this.showNotification(`Generated ${this.removalOutputs.length} variations`, 'success');
        },
        
        
        generateSpecificRemoval() {
            if (!this.removalSpecificInput.trim()) {
                this.showNotification('Please enter text to process', 'error');
                return;
            }
            
            if (!this.removalCharsToRemove) {
                this.showNotification('Please specify characters to remove', 'error');
                return;
            }
            
            const charsToRemove = new Set(this.removalCharsToRemove.split(''));
            this.removalSpecificOutput = this.removalSpecificInput
                .split('')
                .filter(char => !charsToRemove.has(char))
                .join('');
            
            this.showNotification('Characters removed', 'success');
        },
        
        // Copy all removal outputs
        copyAllRemovals() {
            const allText = this.removalOutputs.join('\n');
            this.copyToClipboard(allText);
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
                    }, window.CONFIG.PASTE_FLAG_RESET_DELAY_MS);
                });
            });
        }
    }),
    // Initialize theme and components
    mounted() {
        // Apply theme
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        // Call tool lifecycle hooks
        if (window.toolRegistry && typeof window.toolRegistry.mergeVueLifecycle === 'function') {
            const lifecycleHooks = window.toolRegistry.mergeVueLifecycle();
            if (lifecycleHooks && lifecycleHooks.mounted) {
                lifecycleHooks.mounted.call(this);
            }
        }
        
        // Update registeredTools after Vue is mounted (tools should be loaded by now)
        if (window.toolRegistry && typeof window.toolRegistry.getAll === 'function') {
            this.registeredTools = window.toolRegistry.getAll();
        }
        
        // Close tooltips when clicking outside
        document.addEventListener('click', (e) => {
            // Only close if not clicking on a tooltip icon
            if (!e.target.closest('.tooltip-icon')) {
                document.querySelectorAll('.custom-tooltip.active').forEach(tooltip => {
                    tooltip.classList.remove('active');
                    // Remove tooltip from DOM after transition
                    setTimeout(() => {
                        if (!tooltip.classList.contains('active')) {
                            tooltip.remove();
                        }
                    }, 200);
                });
            }
        });
        
        // Initialize category navigation
        if (this.initializeCategoryNavigation) {
            this.initializeCategoryNavigation();
        }
        
        // Initialize emoji grid with all emojis shown by default
        this.$nextTick(() => {
            // Make sure filtered emojis is populated
            this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
            
            // Define a function to properly initialize the emoji grid
            const initializeEmojiGrid = () => {
                // Only try to initialize when steganography tab is active
                if (this.activeTab !== 'steganography') {
                    return;
                }
                
                const emojiGridContainer = document.getElementById('emoji-grid-container');
                
                if (emojiGridContainer) {
                    // Set inline styles to ensure visibility
                    emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px;');
                    
                    // Also make sure the parent container is visible
                    const emojiLibrary = document.querySelector('.emoji-library');
                    if (emojiLibrary) {
                        emojiLibrary.setAttribute('style', 'display: block !important; visibility: visible !important; margin-top: 20px; overflow: visible;');
                    }
                    
                    // Now render the grid
                    this.renderEmojiGrid();
                    
                    // Stop retrying once we've successfully found and rendered the grid
                    clearInterval(emojiGridInitializer);
                }
            };
            
            // Use an interval instead of recursive setTimeout for more reliable initialization
            // This will try every 500ms until it succeeds or the page is navigated away from
            const emojiGridInitializer = setInterval(initializeEmojiGrid, 500);
            
            // Set up paste event handlers for all textareas to prevent unwanted clipboard notifications
            this.setupPasteHandlers();
        });
    },
    
    // No keyboard shortcuts - they were removed as requested
    created() {
        // Call tool lifecycle hooks
        if (window.toolRegistry && typeof window.toolRegistry.mergeVueLifecycle === 'function') {
            const lifecycleHooks = window.toolRegistry.mergeVueLifecycle();
            if (lifecycleHooks && lifecycleHooks.created) {
                lifecycleHooks.created.call(this);
            }
        }
        // Initialize any required functionality
        // But no keyboard shortcuts/hotkeys for now
    },
    
    // Watch for input events and ensure proper focus handling
    watch: Object.assign(
        (window.toolRegistry && typeof window.toolRegistry.mergeVueWatchers === 'function') 
            ? window.toolRegistry.mergeVueWatchers() 
            : {},
        {
            // Watch transform input to update transforms
            transformInput() {
                // Only auto-transform if we have an active transform
                if (this.activeTransform && this.activeTab === 'transforms') {
                    this.transformOutput = this.activeTransform.func(this.transformInput);
                }
            }
            // Note: Removed watchers for emojiMessage and decodeInput that were
            // unnecessarily re-rendering the emoji grid on every keystroke.
            // The emoji grid is now only rendered when switching tabs or categories,
            // which prevents losing the selected emoji state while typing.
        }
    )
});
