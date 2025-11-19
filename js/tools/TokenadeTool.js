/**
 * Tokenade Tool - Token bomb generator tool
 * Note: This is a complex tool, so we'll include the key methods
 */
class TokenadeTool extends Tool {
    constructor() {
        super({
            id: 'tokenade',
            name: 'Tokenade',
            icon: 'fa-bomb',
            title: 'Tokenade Generator',
            order: 4
        });
    }
    
    getVueData() {
        return {
            tbDepth: 3,
            tbBreadth: 4,
            tbRepeats: 5,
            tbSeparator: 'zwnj',
            tbIncludeVS: true,
            tbIncludeNoise: true,
            tbRandomizeEmojis: true,
            tbAutoCopy: true,
            tbSingleCarrier: true,
            tbCarrier: '',
            tbPayloadEmojis: [],
            tokenBombOutput: '',
            tpBase: '',
            tpRepeat: 100,
            tpCombining: true,
            tpZW: false,
            textPayload: '',
            dangerThresholdTokens: 25_000_000,
            quickCarrierEmojis: ['🐍','🐉','🐲','🔥','💥','🗿','⚓','⭐','✨','🚀','💀','🪨','🍃','🪶','🔮','🐢','🐊','🦎'],
            tbCarrierManual: '',
            carrierEmojiList: [...(window.emojiLibrary ? window.emojiLibrary.EMOJI_LIST : [])]
        };
    }
    
    getVueMethods() {
        // Note: These methods reference code from app.js - they'll need access to the full implementation
        // For now, we'll mark them as needing the full methods from app.js
        return {
            generateTokenBomb: function() {
                // This method is complex - it's in app.js lines 1266-1373
                // We'll need to ensure it's available in the Vue instance
                if (typeof this._generateTokenBomb === 'function') {
                    return this._generateTokenBomb();
                }
                console.warn('generateTokenBomb method not available');
            },
            applyTokenadePreset: function(preset) {
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
            estimateTokenadeLength: function() {
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
                    const avgDigits = 5;
                    const perUnit = avgDigits + 1 + sepLen + (this.tbIncludeNoise ? 2 : 0);
                    const carrierLen = 1 + (this.tbIncludeVS ? 1 : 0);
                    return carrierLen + totalUnits * perUnit;
                } else {
                    const blockLen = lenLevel(depth - 1);
                    return repeats * (blockLen + noiseAvg) + Math.max(0, repeats - 1) * sepLen;
                }
            },
            estimateTokenadeTokens: function() {
                return Math.max(0, this.estimateTokenadeLength());
            },
            setCarrierFromSelected: function() {
                if (this.selectedEmoji) this.tbCarrier = String(this.selectedEmoji);
            },
            generateTextPayload: function() {
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
            }
        };
    }
    
    getTabContentHTML() {
        // Note: This is a very large template - we'll reference the HTML from index.html
        // For now, return a placeholder that indicates it needs to be loaded
        return `<!-- Tokenade Tool Content - loaded from index.html template -->`;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenadeTool;
} else {
    window.TokenadeTool = TokenadeTool;
}



