/**
 * Application Configuration Constants
 * Centralized configuration values to avoid magic numbers
 */

window.CONFIG = {
    // Clipboard settings
    CLIPBOARD_DEBOUNCE_MS: 500,
    CLIPBOARD_FALLBACK_DEBOUNCE_MS: 300,
    CLIPBOARD_LOCK_TIMEOUT_MS: 500,
    KEYBOARD_EVENTS_TIMEOUT_MS: 1000,
    
    // History settings
    MAX_HISTORY_ITEMS: 10,
    
    // Emoji grid settings
    EMOJI_GRID_RETRY_MAX: 5,
    EMOJI_GRID_RETRY_INTERVAL_MS: 500,
    
    // Tokenade settings
    DANGER_THRESHOLD_TOKENS: 25_000_000,
    
    // Notification settings
    NOTIFICATION_DISPLAY_TIME_MS: 1000,
    NOTIFICATION_FADE_OUT_TIME_MS: 300,
    COPIED_POPUP_DISPLAY_TIME_MS: 1500,
    COPIED_POPUP_FADE_TIME_MS: 300,
    
    // Paste handler settings
    PASTE_FLAG_RESET_DELAY_MS: 100
};

