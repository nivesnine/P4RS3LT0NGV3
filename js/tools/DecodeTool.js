/**
 * Decode Tool - Universal decoder tool
 */
class DecodeTool extends Tool {
    constructor() {
        super({
            id: 'decoder',
            name: 'Decoder',
            icon: 'fa-key',
            title: 'Universal Decoder (D)',
            order: 2
        });
    }
    
    getVueData() {
        return {
            decoderInput: '',
            decoderOutput: '',
            decoderResult: null,
            selectedDecoder: 'auto'
        };
    }
    
    getVueMethods() {
        return {
            getAllTransformsWithReverse: function() {
                return this.transforms.filter(t => t && typeof t.reverse === 'function');
            },
            runUniversalDecode: function() {
                const input = this.decoderInput;
                
                if (!input) {
                    this.decoderOutput = '';
                    this.decoderResult = null;
                    return;
                }
                
                let result = null;
                
                if (this.selectedDecoder !== 'auto') {
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
                    result = window.universalDecode(input, {
                        activeTab: this.activeTab,
                        activeTransform: this.activeTransform
                    });
                }
                
                this.decoderResult = result;
                this.decoderOutput = result ? result.text : '';
            },
            useAlternative: function(alternative) {
                if (alternative && alternative.text) {
                    this.decoderOutput = alternative.text;
                    this.decoderResult = {
                        method: alternative.method,
                        text: alternative.text,
                        alternatives: this.decoderResult.alternatives.filter(a => a.method !== alternative.method)
                    };
                }
            }
        };
    }
    
    getVueWatchers() {
        return {
            decoderInput() {
                this.runUniversalDecode();
            }
        };
    }
    
    getTabContentHTML() {
        return `
            <div v-if="activeTab === 'decoder'" class="tab-content">
                <div class="transform-layout">
                    <div class="input-section">
                        <div class="input-header">
                            <label for="decoder-input">Paste any encoded text to decode</label>
                            <select v-model="selectedDecoder" @change="runUniversalDecode" style="margin-left: 15px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--input-border); background: var(--button-bg); color: var(--text);">
                                <option value="auto">🔍 Auto-detect</option>
                                <option v-for="transform in getAllTransformsWithReverse()" :key="transform.name" :value="transform.name">
                                    {{ transform.name }}
                                </option>
                            </select>
                        </div>
                        <textarea 
                            id="decoder-input" 
                            v-model="decoderInput" 
                            placeholder="Paste any encoded text here... (Base64, Morse code, Binary, Braille, etc.)"
                            @input="runUniversalDecode"
                        ></textarea>
                    </div>
                    
                    <div class="output-section">
                        <div class="output-header">
                            <label>
                                <span v-if="decoderResult && decoderResult.method">
                                    Decoded using: <strong>{{ decoderResult.method }}</strong>
                                </span>
                                <span v-else>
                                    Decoded Output
                                </span>
                            </label>
                            <button 
                                v-if="decoderOutput" 
                                @click="copyToClipboard(decoderOutput)" 
                                class="copy-button"
                                title="Copy to clipboard"
                            >
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <textarea 
                            id="decoder-output" 
                            :value="decoderOutput" 
                            readonly
                            placeholder="Decoded text will appear here..."
                        ></textarea>
                        
                        <div v-if="decoderResult && decoderResult.alternatives && decoderResult.alternatives.length > 0" class="alternatives-section">
                            <div class="alternatives-header">
                                <i class="fas fa-list"></i> {{ decoderResult.alternatives.length }} Alternative{{ decoderResult.alternatives.length > 1 ? 's' : '' }}:
                            </div>
                            <div class="alternatives-list">
                                <div 
                                    v-for="(alt, index) in decoderResult.alternatives" 
                                    :key="index" 
                                    class="alternative-item"
                                >
                                    <div class="alternative-method">{{ alt.method }}</div>
                                    <div class="alternative-preview">{{ alt.text.substring(0, 100) }}{{ alt.text.length > 100 ? '...' : '' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecodeTool;
} else {
    window.DecodeTool = DecodeTool;
}



