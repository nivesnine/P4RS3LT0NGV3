/**
 * Copy History Management
 * Manages the history of copied content
 */

window.HistoryUtils = {
    /**
     * Add an item to copy history
     * @param {Array} historyArray - The history array (from Vue data)
     * @param {number} maxItems - Maximum number of items to keep
     * @param {string} source - Source of the copy operation
     * @param {string} content - Content that was copied
     */
    addToHistory(historyArray, maxItems, source, content) {
        // Create history item with timestamp
        const historyItem = {
            source: source,
            content: content,
            timestamp: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        };
        
        // Add to beginning of array (most recent first)
        historyArray.unshift(historyItem);
        
        // Limit history to maxItems
        if (historyArray.length > maxItems) {
            historyArray.pop();
        }
    }
};

