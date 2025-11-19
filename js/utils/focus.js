/**
 * Focus Utilities
 * Helper functions for managing focus without scrolling
 */

window.FocusUtils = {
    /**
     * Focus an element without causing the page to scroll
     * @param {HTMLElement} el - Element to focus
     */
    focusWithoutScroll(el) {
        if (!el) return;
        const x = window.scrollX, y = window.scrollY;
        try {
            el.focus({ preventScroll: true });
        } catch (e) {
            el.focus();
            window.scrollTo(x, y);
        }
    }
};

