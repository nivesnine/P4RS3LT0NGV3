/**
 * Universal Decoder - Attempts to automatically decode text using various methods
 * @param {string} input - The encoded text to decode
 * @param {object} context - Optional context with activeTab and activeTransform
 * @returns {object|null} - Returns {text, method, alternatives} if decoded, null otherwise
 */
function universalDecode(input, context = {}) {
    if (!input) return null;
    
    const allDecodings = [];
    const { activeTab, activeTransform } = context;
    
    function addDecoding(text, method, priority = 20) {
        if (text && text !== input && text.length > 0) {
            const exists = allDecodings.some(d => d.text === text);
            if (!exists) {
                allDecodings.push({ text, method, priority });
            }
        }
    }
    
    // Run all transformer detectors
    let foundHighPriorityMatch = false;
    for (const [transformKey, transform] of Object.entries(window.transforms)) {
        if (transform.detector && transform.reverse) {
            try {
                if (transform.detector(input)) {
                    const result = transform.reverse(input);
                    if (result && result !== input && result.length > 0) {
                        const hasContent = result.replace(/[\x00-\x1F\x7F-\x9F\s]/g, '').length > 0;
                        if (hasContent) {
                            const detectorPriority = transform.priority || 285;
                            addDecoding(result, transform.name, detectorPriority);
                            if (detectorPriority >= 280) {
                                foundHighPriorityMatch = true;
                            }
                        }
                    }
                }
            } catch (e) {
                // Error in detector - silently continue
            }
        }
    }
    
    // Early return for exclusive matches (priority >= 280)
    if (foundHighPriorityMatch || allDecodings.some(d => d.priority >= 280)) {
        const exclusiveMatches = allDecodings.filter(d => d.priority >= 280);
        if (exclusiveMatches.length > 0) {
            exclusiveMatches.sort((a, b) => b.priority - a.priority);
            return {
                text: exclusiveMatches[0].text,
                method: exclusiveMatches[0].method,
                alternatives: exclusiveMatches.slice(1).map(d => ({ text: d.text, method: d.method }))
            };
        }
    }
    
    // Emoji steganography (special case)
    if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}]/u.test(input)) {
        try {
            const decoded = window.steganography.decodeEmoji(input);
            if (decoded) {
                addDecoding(decoded, 'Emoji Steganography', 100);
            }
        } catch (e) {
            // Error decoding emoji steganography - silently continue
        }
    }
    
    // Active transform context (priority boost)
    if (activeTab === 'transforms' && activeTransform) {
        try {
            const transformKey = Object.keys(window.transforms).find(
                key => window.transforms[key].name === activeTransform.name
            );
            
            if (transformKey && window.transforms[transformKey].reverse) {
                const result = window.transforms[transformKey].reverse(input);
                if (result && result !== input) {
                    addDecoding(result, activeTransform.name, 150);
                }
            }
        } catch (e) {
            console.error('Error decoding with active transform:', e);
        }
    }
    
    // Fallback for transforms without detectors
    for (const name in window.transforms) {
        const transform = window.transforms[name];
        // Skip transforms with detectors (already tested above)
        if (transform.reverse && !transform.detector) {
            try {
                const result = transform.reverse(input);
                if (result !== input && /[a-zA-Z0-9\s]{3,}/.test(result)) {
                    addDecoding(result, transform.name, 10);
                }
            } catch (e) {
                console.error(`Error decoding with ${name}:`, e);
            }
        }
    }

    allDecodings.sort((a, b) => b.priority - a.priority);
    
    if (allDecodings.length === 0) return null;
    
    const primary = allDecodings[0];
    const alternatives = allDecodings.slice(1).map(({ text, method }) => ({ text, method }));
    
    return { text: primary.text, method: primary.method, alternatives };
}