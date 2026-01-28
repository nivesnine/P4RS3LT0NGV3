/**
 * ASCII Art Tool - Generate ASCII art from text using art styles
 */
class AsciiArtTool extends Tool {
    constructor() {
        super({
            id: 'asciiart',
            name: 'ASCII Art',
            icon: 'fa-font',
            title: 'ASCII Art Generator',
            order: 8
        });
    }
    
    getVueData() {
        // Initialize with empty array - will be populated in mounted hook
        return {
            asciiInput: '',
            asciiOutput: '',
            asciiArtStyles: [],
            asciiSelectedStyle: null,
            asciiStyleOptions: {}
        };
    }
    
    getVueLifecycle() {
        return {
            mounted: function() {
                // Load art styles when component is mounted
                this.loadArtStyles();
            }
        };
    }
    
    getVueMethods() {
        return {
            loadArtStyles: function() {
                // Get available art styles
                const artstyles = (window.artstyles && Object.keys(window.artstyles).length > 0)
                    ? Object.entries(window.artstyles)
                        .map(([key, style]) => ({
                            key: key,
                            name: style.name,
                            description: style.description,
                            customOptions: style.customOptions || []
                        }))
                    : [];
                
                this.asciiArtStyles = artstyles;
                
                // Set default style if not already set
                if (!this.asciiSelectedStyle && artstyles.length > 0) {
                    const defaultStyle = artstyles.find(s => s.key === 'standard') || artstyles[0];
                    this.asciiSelectedStyle = defaultStyle.key;
                    this.asciiStyleOptions = this.getDefaultOptionsForStyle(defaultStyle);
                }
            },
            
            getDefaultOptionsForStyle: function(style) {
                const options = {};
                if (style && style.customOptions && Array.isArray(style.customOptions)) {
                    style.customOptions.forEach(opt => {
                        options[opt.name] = opt.default !== undefined ? opt.default : (opt.type === 'number' ? 0 : '');
                    });
                }
                return options;
            },
            
            onStyleChange: function() {
                // When style changes, reset options to defaults for that style
                const style = this.asciiArtStyles.find(s => s.key === this.asciiSelectedStyle);
                if (style) {
                    this.asciiStyleOptions = this.getDefaultOptionsForStyle(style);
                    // Regenerate art if there's input
                    if (this.asciiInput) {
                        this.generateAsciiArt();
                    }
                }
            },
            
            getCurrentStyle: function() {
                if (!this.asciiSelectedStyle || !window.artstyles) {
                    return null;
                }
                return window.artstyles[this.asciiSelectedStyle] || null;
            },
            
            generateAsciiArt: function() {
                if (!this.asciiInput) {
                    this.asciiOutput = '';
                    return;
                }
                
                const style = this.getCurrentStyle();
                if (!style) {
                    this.asciiOutput = '';
                    this.showNotification('No art style selected', 'error', 'fas fa-exclamation-triangle');
                    return;
                }
                
                try {
                    // Call the style's func with text and current options
                    this.asciiOutput = style.func(this.asciiInput, this.asciiStyleOptions);
                } catch (error) {
                    console.error('Error generating ASCII art:', error);
                    this.showNotification('Error generating ASCII art: ' + error.message, 'error', 'fas fa-exclamation-triangle');
                    this.asciiOutput = '';
                }
            },
            
            copyAsciiArt: function() {
                if (this.asciiOutput) {
                    this.copyToClipboard(this.asciiOutput);
                    this.showNotification('ASCII art copied!', 'success', 'fas fa-copy');
                }
            }
        };
    }
    
    getVueWatchers() {
        return {
            asciiInput() {
                if (this.activeTab === 'asciiart') {
                    this.generateAsciiArt();
                }
            },
            asciiSelectedStyle() {
                if (this.activeTab === 'asciiart') {
                    this.onStyleChange();
                }
            },
            asciiStyleOptions: {
                handler() {
                    if (this.activeTab === 'asciiart' && this.asciiInput) {
                        this.generateAsciiArt();
                    }
                },
                deep: true // Watch nested properties
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsciiArtTool;
} else {
    window.AsciiArtTool = AsciiArtTool;
}
