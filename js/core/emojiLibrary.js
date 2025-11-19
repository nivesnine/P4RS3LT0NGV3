// Emoji Library for P4RS3LT0NGV3

// Create namespace for emoji library
window.emojiLibrary = {};

// Polyfill for Intl.Segmenter if not available
if (!Intl.Segmenter) {
    console.warn('Intl.Segmenter not available, falling back to basic character splitting');
}

// Helper function to properly split text into grapheme clusters (emojis)
window.emojiLibrary.splitEmojis = function(text) {
    if (Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }
    return Array.from(text);
};

// Helper function to properly join emojis
window.emojiLibrary.joinEmojis = function(emojis) {
    return emojis.join('');
};

// Use categories from emojiData
window.emojiLibrary.CATEGORIES = window.emojiData ? window.emojiData.categories : [
    { id: 'all', name: 'All Emojis', icon: '🔍' }
];

// Get emojis from emojiData for backwards compatibility
window.emojiLibrary.EMOJIS = {};
window.emojiLibrary.EMOJI_LIST = [];

// Populate from emojiData if available
// Using full Unicode 15.1 emoji set (filtered by browser compatibility)
// NOTE: This filtering ONLY affects the UI picker display
//       Decoders and transformers still have access to ALL emojis via window.emojiData
window.emojiLibrary.loadEmojis = function() {
    if (!window.emojiData) return;
    
    // Clear existing data
    window.emojiLibrary.EMOJIS = {};
    window.emojiLibrary.EMOJI_LIST = [];
    
    // Check browser compatibility first
    const useCompatibilityFilter = window.emojiCompatibility && 
                                     window.emojiCompatibility.supportsZWJ !== null;
    
    let filtered = 0;
    
    // Group emojis by category (filter for UI picker only)
    for (const [emoji, data] of Object.entries(window.emojiData)) {
        if (typeof data === 'object' && data.category && data.isSimple) {
            // Check if emoji should be shown in UI based on browser compatibility
            // Users can still INPUT/DECODE any emoji even if filtered from picker
            if (useCompatibilityFilter && !window.emojiCompatibility.shouldShowInPicker(emoji, data)) {
                filtered++;
                continue;
            }
            
            if (!window.emojiLibrary.EMOJIS[data.category]) {
                window.emojiLibrary.EMOJIS[data.category] = [];
            }
            window.emojiLibrary.EMOJIS[data.category].push(emoji);
            window.emojiLibrary.EMOJI_LIST.push(emoji);
        }
    }
    
    // Emojis loaded and filtered for UI picker
    
    // Save emoji test cache to localStorage after testing
    if (window.emojiCompatibility && window.emojiCompatibility.saveCache) {
        window.emojiCompatibility.saveCache();
    }
};

// Load emojis initially (will be reloaded after compatibility check)
if (window.emojiData) {
    window.emojiLibrary.loadEmojis();
}

// Function to render emoji grid with categories
window.emojiLibrary.renderEmojiGrid = function(containerId, onEmojiSelect, filteredList) {
    // Get container by ID
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Add header with instruction message
    const emojiHeader = document.createElement('div');
    emojiHeader.className = 'emoji-header';
    emojiHeader.innerHTML = '<h3><i class="fas fa-icons"></i> Choose an Emoji</h3><p class="emoji-subtitle"><i class="fas fa-magic"></i> Click any emoji to copy your hidden message</p>';
    container.appendChild(emojiHeader);
    
    // Create category tabs
    const categoryTabs = document.createElement('div');
    categoryTabs.className = 'emoji-category-tabs';
    
    // Add category tabs
    window.emojiLibrary.CATEGORIES.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'emoji-category-tab';
        if (category.id === 'all') {
            tab.classList.add('active');
        }
        tab.setAttribute('data-category', category.id);
        tab.innerHTML = `${category.icon} ${category.name}`;
        categoryTabs.appendChild(tab);
    });
    
    container.appendChild(categoryTabs);
    
    // Create emoji grid with enforced styling
    const gridContainer = document.createElement('div');
    gridContainer.className = 'emoji-grid';
    
    // Get the active category
    let activeCategory = 'all';
    const activeCategoryTab = container.querySelector('.emoji-category-tab.active');
    if (activeCategoryTab) {
        activeCategory = activeCategoryTab.getAttribute('data-category');
    }
    
    // Determine which emojis to show based on category and filter
    let emojisToShow = [];
    
    if (filteredList && filteredList.length > 0) {
        // If we have a filtered list (from search), use that
        emojisToShow = filteredList;
    } else if (activeCategory === 'all') {
        // For 'all' category, combine all emojis from the categories and deduplicate
        Object.values(window.emojiLibrary.EMOJIS).forEach(categoryEmojis => {
            emojisToShow = [...emojisToShow, ...categoryEmojis];
        });
        // Remove duplicates using Set
        emojisToShow = Array.from(new Set(emojisToShow));
    } else if (window.emojiLibrary.EMOJIS[activeCategory]) {
        // For specific category, use emojis from that category
        emojisToShow = window.emojiLibrary.EMOJIS[activeCategory];
    }
    
    // Add emojis to grid with enforced styling
    emojisToShow.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.className = 'emoji-button';
        emojiButton.textContent = emoji; // Use textContent for better emoji handling
        emojiButton.title = 'Click to encode with this emoji';
        
        emojiButton.addEventListener('click', () => {
            if (typeof onEmojiSelect === 'function') {
                onEmojiSelect(emoji);
                // Add visual feedback when clicked
                emojiButton.style.backgroundColor = '#e6f7ff';
                setTimeout(() => {
                    emojiButton.style.backgroundColor = '';
                }, 300);
            }
        });
        
        gridContainer.appendChild(emojiButton);
    });
    
    container.appendChild(gridContainer);
    
    // Add event listeners to category tabs
    const categoryTabButtons = container.querySelectorAll('.emoji-category-tab');
    categoryTabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            categoryTabButtons.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Re-render the emoji grid with the selected category
            const selectedCategory = tab.getAttribute('data-category');

            // Determine which emojis to show
            let emojisToShow = [];
            if (selectedCategory === 'all') {
                // For 'all' category, combine all emojis from the categories and deduplicate
                Object.values(window.emojiLibrary.EMOJIS).forEach(categoryEmojis => {
                    emojisToShow = [...emojisToShow, ...categoryEmojis];
                });
                // Remove duplicates using Set
                emojisToShow = Array.from(new Set(emojisToShow));
            } else if (window.emojiLibrary.EMOJIS[selectedCategory]) {
                // For specific category, use emojis from that category
                emojisToShow = window.emojiLibrary.EMOJIS[selectedCategory];
            }

            // Clear only the grid and rebuild it
            gridContainer.innerHTML = '';

            // Add emojis to grid
            emojisToShow.forEach(emoji => {
                const emojiButton = document.createElement('button');
                emojiButton.className = 'emoji-button';
                emojiButton.textContent = emoji;
                emojiButton.title = 'Click to encode with this emoji';

                emojiButton.addEventListener('click', () => {
                    if (typeof onEmojiSelect === 'function') {
                        onEmojiSelect(emoji);
                        // Add visual feedback when clicked
                        emojiButton.style.backgroundColor = '#e6f7ff';
                        setTimeout(() => {
                            emojiButton.style.backgroundColor = '';
                        }, 300);
                    }
                });

                gridContainer.appendChild(emojiButton);
            });
            
            // Update the count display
            const countDisplay = container.querySelector('.emoji-count');
            if (countDisplay) {
                countDisplay.textContent = `${emojisToShow.length} emojis available`;
            }
        });
    });
    
    // Debug info - add count display
    const countDisplay = document.createElement('div');
    countDisplay.className = 'emoji-count';
    countDisplay.textContent = `${emojisToShow.length} emojis available`;
    container.appendChild(countDisplay);
};
