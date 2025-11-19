/**
 * Emoji Compatibility Checker
 * Tests which emoji features the user's browser/device supports
 */

window.emojiCompatibility = {
    // Cache key for localStorage
    CACHE_KEY: 'emojiTestResults_v2_latest', // v2 for latest Unicode version
    CACHE_EXPIRY_DAYS: 30,
    
    // In-memory cache for emoji test results
    _emojiTestCache: null,
    
    /**
     * Load emoji test cache from localStorage
     */
    loadCache: function() {
        if (this._emojiTestCache) return this._emojiTestCache;
        
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            
            // Check if cache is expired
            const now = Date.now();
            const age = now - data.timestamp;
            const maxAge = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            
            if (age > maxAge) {
                localStorage.removeItem(this.CACHE_KEY);
                return null;
            }
            
            this._emojiTestCache = data.results;
            return this._emojiTestCache;
        } catch (e) {
            return null;
        }
    },
    
    /**
     * Save emoji test results to localStorage
     * (Called after testing all emojis)
     */
    saveCache: function() {
        if (!this._emojiTestCache) return;
        
        try {
            const data = {
                timestamp: Date.now(),
                results: this._emojiTestCache
            };
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('⚠️  Could not save emoji test cache:', e);
        }
    },
    
    /**
     * Clear the emoji test cache (useful for debugging or forcing refresh)
     */
    clearCache: function() {
        localStorage.removeItem(this.CACHE_KEY);
        this._emojiTestCache = null;
    },
    
    /**
     * Test if a specific emoji actually renders in the browser
     * (canvas-based render test with fallback detection + caching)
     */
    testEmojiRenders: function(emoji) {
        // Load cache if not already loaded
        if (!this._emojiTestCache) {
            this._emojiTestCache = this.loadCache() || {};
        }
        
        // Check cache first
        if (emoji in this._emojiTestCache) {
            return this._emojiTestCache[emoji];
        }
        
        // Cache canvas for performance
        if (!this._testCanvas) {
            this._testCanvas = document.createElement('canvas');
            this._testCanvas.width = 100;
            this._testCanvas.height = 50;
            // Set willReadFrequently for better performance with multiple getImageData calls
            this._testCtx = this._testCanvas.getContext('2d', { willReadFrequently: true });
        }
        
        const ctx = this._testCtx;
        ctx.font = '32px Arial';
        ctx.textBaseline = 'top';
        
        // Measure the width of the emoji
        const emojiWidth = ctx.measureText(emoji).width;
        
        // Measure reference single character width (using a simple emoji)
        const referenceWidth = ctx.measureText('😊').width;
        
        let result;
        
        // If the emoji renders much wider than a single emoji, it's likely broken into multiple chars
        // This catches "???" and other multi-character fallbacks
        if (emojiWidth > referenceWidth * 1.8) {
            result = false;
        } else {
            // Draw and check if anything rendered
            ctx.clearRect(0, 0, 100, 50);
            ctx.fillStyle = 'black';
            ctx.fillText(emoji, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, 100, 50).data;
            
            // Check if any pixels were drawn
            let hasPixels = false;
            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i + 3] > 0) {
                    hasPixels = true;
                    break;
                }
            }
            
            result = hasPixels;
        }
        
        // Cache the result
        this._emojiTestCache[emoji] = result;
        
        return result;
    },
    
    /**
     * Check if a specific emoji should be shown in the UI picker
     * based on browser compatibility
     */
    shouldShowInPicker: function(emoji, data) {
        // Simple check: Does it actually render?
        // This single test catches all broken emojis regardless of type
        return this.testEmojiRenders(emoji);
    }
};

