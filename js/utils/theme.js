/**
 * Theme Management Utilities
 * Handles theme switching and management
 */

window.ThemeUtils = {
    /**
     * Toggle between dark and light theme
     * @param {boolean} currentTheme - Current theme state (true = dark)
     * @returns {boolean} New theme state
     */
    toggleTheme(currentTheme) {
        const newTheme = !currentTheme;
        document.body.classList.toggle('light-theme');
        return newTheme;
    }
};

