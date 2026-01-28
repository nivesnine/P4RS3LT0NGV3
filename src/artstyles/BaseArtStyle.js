/**
 * Base Art Style Class
 * 
 * Provides structure for ASCII art styles with support for custom options
 * 
 * USAGE:
 * 
 * export default new BaseArtStyle({
 *     name: 'My Style',
 *     func: function(text, options) {
 *         // options contains user-selected values from customOptions
 *         return this.generateArt(text, options);
 *     },
 *     customOptions: [
 *         {
 *             name: 'width',
 *             label: 'Width',
 *             type: 'number',
 *             default: 5,
 *             min: 1,
 *             max: 20
 *         },
 *         {
 *             name: 'font',
 *             label: 'Font Style',
 *             type: 'select',
 *             default: 'standard',
 *             options: [
 *                 { value: 'standard', label: 'Standard' },
 *                 { value: 'bold', label: 'Bold' }
 *             ]
 *         }
 *     ]
 * });
 */

export class BaseArtStyle {
    /**
     * Create a new art style
     * @param {Object} config - Art style configuration
     * @param {string} config.name - Display name (required)
     * @param {Function} config.func - Art generation function (text, options) => string (required)
     * @param {Array} [config.customOptions] - Array of custom option definitions
     * @param {string} [config.description] - Help text
     */
    constructor(config) {
        if (!config.name || !config.func) {
            throw new Error('Art style requires at least "name" and "func"');
        }

        // Copy ALL config properties to instance
        Object.assign(this, config);
        
        // Bind the function to this instance
        this.func = config.func.bind(this);
        
        // Validate custom options
        if (this.customOptions && Array.isArray(this.customOptions)) {
            this.customOptions = this.customOptions.map(opt => {
                if (!opt.name || !opt.label || !opt.type) {
                    throw new Error(`Custom option must have name, label, and type`);
                }
                return {
                    ...opt,
                    value: opt.default !== undefined ? opt.default : (opt.type === 'number' ? 0 : '')
                };
            });
        } else {
            this.customOptions = [];
        }
    }

    /**
     * Get default option values
     * @returns {Object} Object with option names as keys and default values
     */
    getDefaultOptions() {
        const defaults = {};
        if (this.customOptions) {
            this.customOptions.forEach(opt => {
                defaults[opt.name] = opt.default !== undefined ? opt.default : (opt.type === 'number' ? 0 : '');
            });
        }
        return defaults;
    }

    /**
     * Get art style info as JSON
     */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            hasCustomOptions: this.customOptions && this.customOptions.length > 0,
            customOptions: this.customOptions || []
        };
    }
}

export default BaseArtStyle;

