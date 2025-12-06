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
        const transforms = (window.transforms && Object.keys(window.transforms).length > 0)
            ? Object.entries(window.transforms).map(([key, transform]) => ({
                name: transform.name,
                func: transform.func.bind(transform),
                preview: transform.preview.bind(transform),
                reverse: transform.reverse ? transform.reverse.bind(transform) : null,
                category: transform.category || 'special'
            }))
            : [];
        
        const categorySet = new Set();
        transforms.forEach(transform => {
            if (transform.category) {
                categorySet.add(transform.category);
            }
        });
        
        // Legend categories: always alphabetical (for quick link buttons)
        const allCategories = Array.from(categorySet);
        const categoriesWithoutRandomizer = allCategories.filter(c => c !== 'randomizer');
        const legendCategories = [...categoriesWithoutRandomizer.sort((a, b) => a.localeCompare(b)), 'randomizer'];
        
        // Section categories: can be reordered (load saved order or use alphabetical)
        const savedOrder = this.loadCategoryOrder();
        const sectionCategories = savedOrder && savedOrder.length > 0
            ? this.mergeCategoryOrder(allCategories, savedOrder)
            : [...legendCategories]; // Create a copy so legendCategories remains immutable
        
        // Load last used transforms
        const lastUsed = this.loadLastUsed();
        
        // Load favorites
        const favorites = this.loadFavorites();
        
        return {
            transformInput: '',
            transformOutput: '',
            activeTransform: null,
            transforms: transforms,
            legendCategories: legendCategories, // Always alphabetical for legend
            categories: sectionCategories, // Custom order for sections
            lastUsedTransforms: lastUsed,
            showLastUsed: lastUsed.length > 0,
            favorites: favorites,
            showFavorites: favorites.length > 0
        };
    }
    
    loadCategoryOrder() {
        try {
            const saved = localStorage.getItem('transformCategoryOrder');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load category order:', e);
        }
        return null;
    }
    
    mergeCategoryOrder(allCategories, savedOrder) {
        // Always ensure randomizer is last
        const categoriesWithoutRandomizer = allCategories.filter(c => c !== 'randomizer');
        
        if (!savedOrder || savedOrder.length === 0) {
            // Default: alphabetical, randomizer last
            const sorted = categoriesWithoutRandomizer.sort((a, b) => a.localeCompare(b));
            return [...sorted, 'randomizer'];
        }
        
        // Use saved order, but filter out categories that no longer exist and remove duplicates
        const validSavedOrder = savedOrder
            .filter(cat => allCategories.includes(cat))
            .filter((cat, index, arr) => arr.indexOf(cat) === index); // Remove duplicates
        
        // Find new categories not in saved order
        const newCategories = categoriesWithoutRandomizer.filter(cat => !validSavedOrder.includes(cat));
        
        // Build final order: saved order (filtered, deduplicated) + new categories (alphabetically) + randomizer
        const finalOrder = [...validSavedOrder];
        if (newCategories.length > 0) {
            finalOrder.push(...newCategories.sort((a, b) => a.localeCompare(b)));
        }
        
        // Ensure randomizer is always last and remove any duplicates
        const finalWithoutRandomizer = finalOrder.filter(c => c !== 'randomizer');
        const uniqueFinal = finalWithoutRandomizer.filter((cat, index, arr) => arr.indexOf(cat) === index);
        return [...uniqueFinal, 'randomizer'];
    }
    
    loadLastUsed() {
        try {
            const saved = localStorage.getItem('transformLastUsed');
            if (saved) {
                const data = JSON.parse(saved);
                // Filter to only include transforms that still exist
                if (window.transforms) {
                    return data.filter(item => {
                        return Object.values(window.transforms).some(t => t.name === item.name);
                    }).slice(0, 5); // Keep only top 5
                }
            }
        } catch (e) {
            console.warn('Failed to load last used transforms:', e);
        }
        return [];
    }
    
    saveLastUsed(transformName) {
        try {
            let lastUsed = this.loadLastUsed();
            
            // Remove if already exists
            lastUsed = lastUsed.filter(item => item.name !== transformName);
            
            // Add to front with timestamp
            lastUsed.unshift({
                name: transformName,
                timestamp: Date.now()
            });
            
            // Keep only last 10
            lastUsed = lastUsed.slice(0, 10);
            
            localStorage.setItem('transformLastUsed', JSON.stringify(lastUsed));
        } catch (e) {
            console.warn('Failed to save last used transform:', e);
        }
    }
    
    loadFavorites() {
        try {
            const saved = localStorage.getItem('transformFavorites');
            if (saved) {
                const data = JSON.parse(saved);
                // Filter to only include transforms that still exist
                if (window.transforms) {
                    return data.filter(transformName => {
                        return Object.values(window.transforms).some(t => t.name === transformName);
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to load favorites:', e);
        }
        return [];
    }
    
    saveFavorites(favorites) {
        try {
            localStorage.setItem('transformFavorites', JSON.stringify(favorites));
        } catch (e) {
            console.warn('Failed to save favorites:', e);
        }
    }
    
    getVueMethods() {
        return {
            getDisplayCategory: function(transformName) {
                // Find transform by name and return its category property
                const transform = this.transforms.find(t => t.name === transformName);
                return transform ? transform.category : 'special';
            },
            getTransformsByCategory: function(category) {
                return this.transforms.filter(transform => transform.category === category);
            },
            isSpecialCategory: function(category) {
                return category === 'randomizer';
            },
            applyTransform: function(transform, event) {
                event && event.preventDefault();
                event && event.stopPropagation();
                
                if (transform && transform.name === 'Random Mix') {
                    this.triggerRandomizerChaos();
                }
                
                if (this.transformInput) {
                    this.activeTransform = transform;
                    
                    // Track last used
                    this.saveLastUsedTransform(transform.name);
                    
                    if (transform.name === 'Random Mix') {
                        this.transformOutput = window.transforms.randomizer.func(this.transformInput);
                        const transformInfo = window.transforms.randomizer.getLastTransformInfo();
                        if (transformInfo.length > 0) {
                            const transformsList = transformInfo.map(t => t.transformName).join(', ');
                            this.showNotification(`Mixed with: ${transformsList}`, 'success', 'fas fa-random');
                        }
                    } else {
                        this.transformOutput = transform.func(this.transformInput);
                    }
                    
                    this.isTransformCopy = true;
                    this.forceCopyToClipboard(this.transformOutput);
                    
                    if (transform.name !== 'Random Mix') {
                        this.showNotification(`${transform.name} applied and copied!`, 'success', 'fas fa-check');
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
            saveLastUsedTransform: function(transformName) {
                try {
                    let lastUsed = this.lastUsedTransforms || [];
                    
                    // Remove if already exists
                    lastUsed = lastUsed.filter(item => item.name !== transformName);
                    
                    // Add to front with timestamp
                    lastUsed.unshift({
                        name: transformName,
                        timestamp: Date.now()
                    });
                    
                    // Keep only last 5
                    lastUsed = lastUsed.slice(0, 5);
                    
                    this.lastUsedTransforms = lastUsed;
                    this.showLastUsed = lastUsed.length > 0;
                    
                    localStorage.setItem('transformLastUsed', JSON.stringify(lastUsed));
                } catch (e) {
                    console.warn('Failed to save last used transform:', e);
                }
            },
            getLastUsedTransforms: function() {
                if (!this.lastUsedTransforms || this.lastUsedTransforms.length === 0) {
                    return [];
                }
                
                return this.lastUsedTransforms
                    .map(item => {
                        return this.transforms.find(t => t.name === item.name);
                    })
                    .filter(t => t !== undefined);
            },
            toggleFavorite: function(transformName, event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                const index = this.favorites.indexOf(transformName);
                if (index > -1) {
                    // Remove from favorites
                    this.favorites.splice(index, 1);
                    this.showNotification('Removed from favorites', 'success', 'fas fa-star');
                } else {
                    // Add to favorites
                    this.favorites.push(transformName);
                    this.showNotification('Added to favorites', 'success', 'fas fa-star');
                }
                
                this.showFavorites = this.favorites.length > 0;
                this.saveFavorites(this.favorites);
            },
            isFavorite: function(transformName) {
                return this.favorites && this.favorites.includes(transformName);
            },
            getFavoriteTransforms: function() {
                if (!this.favorites || this.favorites.length === 0) {
                    return [];
                }
                
                return this.favorites
                    .map(transformName => {
                        return this.transforms.find(t => t.name === transformName);
                    })
                    .filter(t => t !== undefined);
            },
            saveFavorites: function(favorites) {
                try {
                    localStorage.setItem('transformFavorites', JSON.stringify(favorites));
                } catch (e) {
                    console.warn('Failed to save favorites:', e);
                }
            },
            moveCategoryUp: function(categoryIndex) {
                if (categoryIndex <= 0) return;
                
                // Never allow moving randomizer itself
                if (this.categories[categoryIndex] === 'randomizer') return;
                
                // Use Vue's array mutation methods for proper reactivity
                const categoryToMove = this.categories[categoryIndex];
                this.categories.splice(categoryIndex, 1);
                this.categories.splice(categoryIndex - 1, 0, categoryToMove);
                
                this.saveCategoryOrder(this.categories);
                this.showNotification('Category order saved', 'success', 'fas fa-check');
            },
            moveCategoryDown: function(categoryIndex) {
                // Don't allow moving if already at or past the last valid position
                // Last position is reserved for randomizer, so we can't move to it
                if (categoryIndex >= this.categories.length - 2) return;
                
                // Never allow moving randomizer itself
                if (this.categories[categoryIndex] === 'randomizer') return;
                
                // Use Vue's array mutation methods for proper reactivity
                const categoryToMove = this.categories[categoryIndex];
                this.categories.splice(categoryIndex, 1);
                this.categories.splice(categoryIndex + 1, 0, categoryToMove);
                
                this.saveCategoryOrder(this.categories);
                this.showNotification('Category order saved', 'success', 'fas fa-check');
            },
            saveCategoryOrder: function(categories) {
                try {
                    // Remove duplicates before saving
                    const uniqueCategories = categories.filter((cat, index, arr) => arr.indexOf(cat) === index);
                    localStorage.setItem('transformCategoryOrder', JSON.stringify(uniqueCategories));
                } catch (e) {
                    console.warn('Failed to save category order:', e);
                }
            },
            autoTransform: function() {
                if (this.transformInput && this.activeTransform && this.activeTab === 'transforms') {
                    const segments = window.EmojiUtils.splitEmojis(this.transformInput);
                    const transformedSegments = segments.map(segment => {
                        if (segment.length > 1 || /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(segment)) {
                            return segment;
                        }
                        return this.activeTransform.func(segment);
                    });
                    this.transformOutput = window.EmojiUtils.joinEmojis(transformedSegments);
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
                
                // Save initial category order to localStorage if it doesn't exist
                // This ensures consistent state for category reordering operations
                try {
                    const saved = localStorage.getItem('transformCategoryOrder');
                    if (!saved && this.categories && this.categories.length > 0) {
                        this.saveCategoryOrder(this.categories);
                    }
                } catch (e) {
                    console.warn('Failed to check/save initial category order:', e);
                }
            }
        };
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



