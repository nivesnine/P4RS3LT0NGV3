/**
 * Emoji Tool - Steganography/Emoji encoding tool
 */
class EmojiTool extends Tool {
    constructor() {
        super({
            id: 'steganography',
            name: 'Emoji',
            icon: 'fa-smile',
            title: 'Hide text in emojis (H)',
            order: 3
        });
    }
    
    getVueData() {
        return {
            emojiMessage: '',
            encodedMessage: '',
            decodeInput: '',
            decodedMessage: '',
            selectedCarrier: null,
            activeSteg: null,
            carriers: window.steganography.carriers,
            filteredEmojis: [...window.emojiLibrary.EMOJI_LIST],
            selectedEmoji: null,
            carrierEmojiList: [...window.emojiLibrary.EMOJI_LIST],
            quickCarrierEmojis: ['🐍','🐉','🐲','🔥','💥','🗿','⚓','⭐','✨','🚀','💀','🪨','🍃','🪶','🔮','🐢','🐊','🦎']
        };
    }
    
    getVueMethods() {
        return {
            selectCarrier: function(carrier) {
                if (this.selectedCarrier === carrier) {
                    this.selectedCarrier = null;
                    this.encodedMessage = '';
                } else {
                    this.selectedCarrier = carrier;
                    this.activeSteg = 'emoji';
                    this.autoEncode();
                }
            },
            setStegMode: function(mode) {
                if (mode === 'invisible') {
                    this.activeSteg = mode;
                    this.selectedCarrier = null;
                    this.autoEncode();
                    
                    if (this.encodedMessage) {
                        this.$nextTick(() => {
                            this.forceCopyToClipboard(this.encodedMessage);
                            this.showNotification('<i class="fas fa-check"></i> Invisible text created and copied!', 'success');
                            this.addToCopyHistory('Invisible Text', this.encodedMessage);
                        });
                    }
                } else {
                    if (this.activeSteg === mode) {
                        this.activeSteg = null;
                        this.encodedMessage = '';
                    } else {
                        this.activeSteg = mode;
                        this.autoEncode();
                    }
                }
            },
            autoEncode: function() {
                if (!this.emojiMessage || this.activeTab !== 'steganography') {
                    this.encodedMessage = '';
                    return;
                }
                
                if (this.activeSteg === 'invisible') {
                    this.encodedMessage = window.steganography.encodeInvisible(this.emojiMessage);
                } else if (this.selectedCarrier) {
                    this.encodedMessage = window.steganography.encodeEmoji(
                        this.selectedCarrier.emoji,
                        this.emojiMessage
                    );
                }
            },
            selectEmoji: function(emoji) {
                const emojiStr = String(emoji);
                
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(emojiStr)
                        .then(() => {
                            this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                            this.addToCopyHistory('Emoji', emojiStr);
                        })
                        .catch(err => {
                            console.warn('Emoji clipboard API failed:', err);
                            this.forceCopyToClipboard(emojiStr);
                            this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                            this.addToCopyHistory('Emoji', emojiStr);
                        });
                } else {
                    this.forceCopyToClipboard(emojiStr);
                    this.showNotification(`<i class="fas fa-check"></i> Emoji copied!`, 'success');
                    this.addToCopyHistory('Emoji', emojiStr);
                }
                
                if (this.activeTab === 'steganography') {
                    this.selectedEmoji = emoji;
                    
                    const tempCarrier = {
                        name: `${emoji} Carrier`,
                        emoji: emoji,
                        encode: (text) => this.steganography.encode(text, emoji),
                        decode: (text) => this.steganography.decode(text),
                        preview: (text) => `${emoji}${text}${emoji}`
                    };
                    
                    this.selectedCarrier = tempCarrier;
                    this.activeSteg = 'emoji';
                    
                    if (this.emojiMessage) {
                        this.autoEncode();
                        
                        this.$nextTick(() => {
                            if (this.encodedMessage) {
                                const encodedStr = String(this.encodedMessage);
                                
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                    navigator.clipboard.writeText(encodedStr)
                                        .then(() => {
                                            this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                            this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                                        })
                                        .catch(err => {
                                            console.warn('Encoded emoji clipboard API failed:', err);
                                            this.forceCopyToClipboard(encodedStr);
                                            this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                            this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                                        });
                                } else {
                                    this.forceCopyToClipboard(encodedStr);
                                    this.showNotification(`<i class="fas fa-check"></i> Hidden message copied with ${emoji}`, 'success');
                                    this.addToCopyHistory(`Hidden Message with ${emoji}`, encodedStr);
                                }
                            }
                        });
                    }
                }
            },
            renderEmojiGrid: function() {
                const container = document.getElementById('emoji-grid-container');
                if (!container) {
                    console.error('emoji-grid-container not found!');
                    return;
                }
                
                container.style.cssText = 'display: block !important; visibility: visible !important; min-height: 300px;';
                
                const emojiLibrary = document.querySelector('.emoji-library');
                if (emojiLibrary) {
                    emojiLibrary.style.cssText = 'display: block !important; visibility: visible !important;';
                }
                
                container.innerHTML = '';
                window.emojiLibrary.renderEmojiGrid('emoji-grid-container', this.selectEmoji.bind(this), this.filteredEmojis);
            },
            filterEmojis: function() {
                this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
                this.renderEmojiGrid();
            }
        };
    }
    
    getVueLifecycle() {
        return {
            mounted() {
                this.$nextTick(() => {
                    this.filteredEmojis = [...window.emojiLibrary.EMOJI_LIST];
                    
                    const initializeEmojiGrid = () => {
                        if (this.activeTab !== 'steganography') {
                            return;
                        }
                        
                        const emojiGridContainer = document.getElementById('emoji-grid-container');
                        if (emojiGridContainer) {
                            emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px;');
                            
                            const emojiLibrary = document.querySelector('.emoji-library');
                            if (emojiLibrary) {
                                emojiLibrary.setAttribute('style', 'display: block !important; visibility: visible !important; margin-top: 20px; overflow: visible;');
                            }
                            
                            this.renderEmojiGrid();
                            clearInterval(emojiGridInitializer);
                        }
                    };
                    
                    const emojiGridInitializer = setInterval(initializeEmojiGrid, 500);
                });
            }
        };
    }
    
    getTabContentHTML() {
        return `
            <div v-if="activeTab === 'steganography'" class="tab-content">
                <div class="transform-layout">
                    <div class="input-section">
                        <textarea 
                            id="steg-input" 
                            v-model="emojiMessage" 
                            placeholder="Enter text to hide..."
                            @input="autoEncode"
                        ></textarea>
                    </div>
                    
                    <div class="emoji-library">
                        <div id="emoji-grid-container" class="emoji-grid-container">
                            <div class="emoji-grid">
                                <button class="emoji-button" onclick="app.selectEmoji('😀')">😀</button>
                                <button class="emoji-button" onclick="app.selectEmoji('😂')">😂</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🥰')">🥰</button>
                                <button class="emoji-button" onclick="app.selectEmoji('😎')">😎</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🤔')">🤔</button>
                                <button class="emoji-button" onclick="app.selectEmoji('👍')">👍</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🎉')">🎉</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🔥')">🔥</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🚀')">🚀</button>
                                <button class="emoji-button" onclick="app.selectEmoji('🐍')">🐍</button>
                            </div>
                        </div>
                        <div class="emoji-library-footer" v-if="selectedEmoji">
                            <div class="selected-emoji-info">
                                <span class="selected-emoji">{{ selectedEmoji }}</span>
                                <span class="selected-emoji-label">Last selected</span>
                            </div>
                        </div>
                    </div>

                    <div class="output-section" v-if="encodedMessage">
                        <div class="output-heading">
                            <h4>
                                <i class="fas fa-check-circle"></i> 
                                Encoded Message
                                <small v-if="selectedCarrier">using {{ selectedCarrier.name }}</small>
                                <small v-else-if="activeSteg === 'invisible'">using Invisible Text</small>
                            </h4>
                        </div>
                        <div class="output-container">
                            <textarea readonly v-model="encodedMessage"></textarea>
                            <button class="copy-button" @click="copyToClipboard(encodedMessage)" title="Copy to clipboard">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="output-instructions">
                            <small><i class="fas fa-info-circle"></i> Copy this text and share it. Only people who know how to decode it will be able to read your message.</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    onActivate(vueInstance) {
        vueInstance.$nextTick(() => {
            const emojiGridContainer = document.getElementById('emoji-grid-container');
            if (emojiGridContainer) {
                emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px;');
                vueInstance.renderEmojiGrid();
            }
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmojiTool;
} else {
    window.EmojiTool = EmojiTool;
}



