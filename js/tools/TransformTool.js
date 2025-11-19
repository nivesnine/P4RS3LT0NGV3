/**
 * Transform Tool - Text transformation tool
 */
class TransformTool extends Tool {
    constructor() {
        super({
            id: 'transforms',
            name: 'Transform',
            icon: 'fa-font',
            title: 'Transform text (T)',
            order: 1
        });
    }
    
    getVueData() {
        return {
            transformInput: '',
            transformOutput: '',
            activeTransform: null,
            transforms: Object.entries(window.transforms || {}).map(([key, transform]) => ({
                name: transform.name,
                func: transform.func.bind(transform),
                preview: transform.preview.bind(transform),
                reverse: transform.reverse ? transform.reverse.bind(transform) : null,
                category: transform.category || 'special'
            }))
        };
    }
    
    getVueMethods() {
        return {
            getDisplayCategory: (transformName) => {
                const categoryMap = {
                    'Base64': 'encoding', 'Base64 URL': 'encoding', 'Base32': 'encoding',
                    'Base45': 'encoding', 'Base58': 'encoding', 'Base62': 'encoding',
                    'Binary': 'encoding', 'Hexadecimal': 'encoding', 'ASCII85': 'encoding',
                    'URL Encode': 'encoding', 'HTML Entities': 'encoding',
                    'Caesar Cipher': 'cipher', 'ROT13': 'cipher', 'ROT47': 'cipher',
                    'ROT18': 'cipher', 'ROT5': 'cipher', 'Morse Code': 'cipher',
                    'Atbash Cipher': 'cipher', 'Vigenère Cipher': 'cipher',
                    'Affine Cipher (a=5,b=8)': 'cipher', 'Rail Fence (3 Rails)': 'cipher',
                    'Baconian Cipher': 'cipher', 'Tap Code': 'cipher', 'A1Z26': 'cipher',
                    'QWERTY Right Shift': 'cipher',
                    'Strikethrough': 'visual', 'Underline': 'visual', 'Reverse Text': 'visual',
                    'Alternating Case': 'visual', 'Reverse Words': 'visual', 'Random Case': 'visual',
                    'Title Case': 'visual', 'Sentence Case': 'visual', 'Emoji Speak': 'visual',
                    'Ubbi Dubbi': 'visual', 'Rövarspråket': 'visual', 'Vaporwave': 'visual',
                    'Disemvowel': 'visual',
                    'Pig Latin': 'format', 'Leetspeak': 'format', 'NATO Phonetic': 'format',
                    'camelCase': 'format', 'snake_case': 'format', 'kebab-case': 'format',
                    'Invisible Text': 'unicode', 'Upside Down': 'unicode', 'Full Width': 'unicode',
                    'Small Caps': 'unicode', 'Bubble': 'unicode', 'Braille': 'unicode',
                    'Greek Letters': 'unicode', 'Wingdings': 'unicode', 'Superscript': 'unicode',
                    'Subscript': 'unicode', 'Regional Indicator Letters': 'unicode',
                    'Fraktur': 'unicode', 'Cyrillic Stylized': 'unicode', 'Katakana': 'unicode',
                    'Hiragana': 'unicode', 'Roman Numerals': 'unicode',
                    'Medieval': 'special', 'Cursive': 'special', 'Monospace': 'special',
                    'Double-Struck': 'special', 'Elder Futhark': 'special', 'Mirror Text': 'special',
                    'Zalgo': 'special',
                    'Quenya (Tolkien Elvish)': 'fantasy', 'Tengwar Script': 'fantasy',
                    'Klingon': 'fantasy', 'Aurebesh (Star Wars)': 'fantasy',
                    'Dovahzul (Dragon)': 'fantasy',
                    'Hieroglyphics': 'ancient', 'Ogham (Celtic)': 'ancient',
                    'Semaphore Flags': 'ancient',
                    'Brainfuck': 'technical', 'Mathematical Notation': 'technical',
                    'Chemical Symbols': 'technical',
                    'Random Mix': 'randomizer'
                };
                return categoryMap[transformName] || 'special';
            },
            getTransformsByCategory: function(category) {
                return this.transforms.filter(transform => 
                    this.getDisplayCategory(transform.name) === category
                );
            },
            applyTransform: function(transform, event) {
                event && event.preventDefault();
                event && event.stopPropagation();
                
                if (transform && transform.name === 'Random Mix') {
                    this.triggerRandomizerChaos();
                }
                
                if (this.transformInput) {
                    this.activeTransform = transform;
                    
                    if (transform.name === 'Random Mix') {
                        this.transformOutput = window.transforms.randomizer.func(this.transformInput);
                        const transformInfo = window.transforms.randomizer.getLastTransformInfo();
                        if (transformInfo.length > 0) {
                            const transformsList = transformInfo.map(t => t.transformName).join(', ');
                            this.showNotification(`<i class="fas fa-random"></i> Mixed with: ${transformsList}`, 'success');
                        }
                    } else {
                        this.transformOutput = transform.func(this.transformInput);
                    }
                    
                    this.isTransformCopy = true;
                    this.forceCopyToClipboard(this.transformOutput);
                    this.addToCopyHistory(`Transform: ${transform.name}`, this.transformOutput);
                    
                    if (transform.name !== 'Random Mix') {
                        this.showNotification(`<i class="fas fa-check"></i> ${transform.name} applied and copied!`, 'success');
                    }
                    
                    document.querySelectorAll('.transform-button').forEach(button => {
                        button.classList.remove('active');
                    });
                    
                    const inputBox = document.querySelector('#transform-input');
                    if (inputBox) {
                        this.focusWithoutScroll(inputBox);
                        const len = inputBox.value.length;
                        try { inputBox.setSelectionRange(len, len); } catch (_) {}
                    }
                    
                    this.isTransformCopy = false;
                    this.ignoreKeyboardEvents = false;
                }
            },
            autoTransform: function() {
                if (this.transformInput && this.activeTransform && this.activeTab === 'transforms') {
                    const segments = window.emojiLibrary.splitEmojis(this.transformInput);
                    const transformedSegments = segments.map(segment => {
                        if (segment.length > 1 || /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(segment)) {
                            return segment;
                        }
                        return this.activeTransform.func(segment);
                    });
                    this.transformOutput = window.emojiLibrary.joinEmojis(transformedSegments);
                }
            },
            initializeCategoryNavigation: function() {
                this.$nextTick(() => {
                    const legendItems = document.querySelectorAll('.transform-category-legend .legend-item');
                    legendItems.forEach(item => {
                        const newItem = item.cloneNode(true);
                        item.parentNode.replaceChild(newItem, item);
                    });
                    
                    document.querySelectorAll('.transform-category-legend .legend-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const targetId = item.getAttribute('data-target');
                            if (targetId) {
                                const targetElement = document.getElementById(targetId);
                                if (targetElement) {
                                    document.querySelectorAll('.transform-category-legend .legend-item').forEach(li => {
                                        li.classList.remove('active-category');
                                    });
                                    item.classList.add('active-category');
                                    
                                    const inputSection = document.querySelector('.input-section');
                                    const inputSectionHeight = inputSection.offsetHeight;
                                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                    const offsetPosition = elementPosition - inputSectionHeight - 10;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                    
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
        };
    }
    
    getVueWatchers() {
        return {
            transformInput() {
                if (this.activeTransform && this.activeTab === 'transforms') {
                    this.transformOutput = this.activeTransform.func(this.transformInput);
                }
            }
        };
    }
    
    getVueLifecycle() {
        return {
            mounted() {
                this.initializeCategoryNavigation();
            }
        };
    }
    
    getTabContentHTML() {
        // This is a large template, so we'll return it as a string
        // The actual HTML is in index.html - we'll need to extract it dynamically
        return `<!-- Transform Tool Content - loaded dynamically -->`;
    }
    
    onActivate(vueInstance) {
        vueInstance.$nextTick(() => {
            vueInstance.initializeCategoryNavigation();
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransformTool;
} else {
    window.TransformTool = TransformTool;
}



