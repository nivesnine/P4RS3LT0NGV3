/**
 * Tokenizer Tool - Tokenizer visualization tool
 */
class TokenizerTool extends Tool {
    constructor() {
        super({
            id: 'tokenizer',
            name: 'Tokenizer',
            icon: 'fa-layer-group',
            title: 'Tokenizer visualization',
            order: 6
        });
    }
    
    getVueData() {
        return {
            tokenizerInput: '',
            tokenizerEngine: 'byte',
            tokenizerTokens: [],
            tokenizerCharCount: 0,
            tokenizerWordCount: 0
        };
    }
    
    getVueMethods() {
        return {
            runTokenizer: async function() {
                const text = this.tokenizerInput || '';
                const engine = this.tokenizerEngine;
                const tokens = [];
                if (!text) { this.tokenizerTokens = []; this.tokenizerCharCount = 0; this.tokenizerWordCount = 0; return; }
                if (engine === 'byte') {
                    const encoder = new TextEncoder();
                    const bytes = encoder.encode(text);
                    for (let i=0;i<bytes.length;i++) {
                        tokens.push({ id: bytes[i], text: `0x${bytes[i].toString(16).padStart(2,'0')}` });
                    }
                } else if (engine === 'word') {
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
                    const encoder = new TextEncoder();
                    const bytes = encoder.encode(text);
                    for (let i=0;i<bytes.length;i++) tokens.push({ id: bytes[i], text: `0x${bytes[i].toString(16).padStart(2,'0')}` });
                }
                this.tokenizerTokens = tokens;
                this.tokenizerCharCount = Array.from(text).length;
                const wordMatches = text.trim().match(/[^\s]+/g) || [];
                this.tokenizerWordCount = wordMatches.length;
            }
        };
    }
    
    getVueWatchers() {
        return {
            tokenizerInput() {
                this.runTokenizer();
            },
            tokenizerEngine() {
                this.runTokenizer();
            }
        };
    }
    
    getTabContentHTML() {
        return `
            <div v-if="activeTab === 'tokenizer'" class="tab-content">
                <div class="transform-layout">
                    <div class="input-section">
                        <div class="section-header">
                            <h3><i class="fas fa-layer-group"></i> Tokenizer Visualization <small>{{ tokenizerEngine }}</small></h3>
                            <p>Paste text to see how different tokenizers segment it.</p>
                        </div>
                        <div class="options-grid" style="margin-bottom:8px;">
                            <label>
                                Engine
                                <select v-model="tokenizerEngine" @change="runTokenizer">
                                    <option value="byte">UTF-8 bytes</option>
                                    <option value="word">Naive words</option>
                                    <option value="cl100k">OpenAI: cl100k_base (GPT‑3.5/4)</option>
                                    <option value="o200k">OpenAI: o200k_base (GPT‑4o)</option>
                                    <option value="p50k">OpenAI: p50k_base</option>
                                    <option value="r50k">OpenAI: r50k_base</option>
                                </select>
                            </label>
                        </div>
                        <textarea 
                            id="tokenizer-input" 
                            v-model="tokenizerInput" 
                            placeholder="Paste text to visualize tokens"
                            @input="runTokenizer"
                        ></textarea>
                    </div>

                    <div class="output-section">
                        <div class="output-heading">
                            <h4>
                                <i class="fas fa-chart-bar"></i> Tokens 
                                <small>{{ tokenizerTokens.length }} total · {{ tokenizerWordCount }} words · {{ tokenizerCharCount }} chars</small>
                            </h4>
                        </div>
                        <div class="token-tiles" v-if="tokenizerTokens.length" style="display:flex; flex-wrap:wrap; gap:6px;">
                            <div v-for="(tok, i) in tokenizerTokens" :key="i" class="token-chip" style="background:var(--button-bg); border:1px solid var(--input-border); padding:6px 8px; border-radius:6px; font-family:'Fira Code', monospace;">
                                <span style="opacity:.75; margin-right:6px;">{{ i }}</span>
                                <span>{{ tok.text }}</span>
                                <span v-if="tok.id !== undefined" style="opacity:.6; margin-left:6px;">#{{ tok.id }}</span>
                            </div>
                        </div>
                        <div class="output-instructions" v-else>
                            <small>Tokens will appear here.</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    onActivate(vueInstance) {
        vueInstance.$nextTick(() => vueInstance.runTokenizer());
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenizerTool;
} else {
    window.TokenizerTool = TokenizerTool;
}



