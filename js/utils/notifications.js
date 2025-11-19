/**
 * Notification System
 * Handles displaying notifications and popups to the user
 */

window.NotificationUtils = {
    /**
     * Show a notification message
     * @param {string} message - HTML message to display
     * @param {string} type - Notification type ('success', 'error', 'warning')
     */
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `copy-notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, window.CONFIG.NOTIFICATION_FADE_OUT_TIME_MS);
        }, window.CONFIG.NOTIFICATION_DISPLAY_TIME_MS);
    },
    
    /**
     * Show a prominent copy confirmation popup
     */
    showCopiedPopup() {
        // Create a more visible popup just for copy operations
        const popup = document.createElement('div');
        popup.className = 'copy-popup';
        popup.innerHTML = '<i class="fas fa-clipboard-check"></i> Copied to clipboard!';
        
        // Add to body
        document.body.appendChild(popup);
        
        // Force it to be visible and centered
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '15px 25px';
        popup.style.borderRadius = '5px';
        popup.style.fontSize = '18px';
        popup.style.fontWeight = 'bold';
        popup.style.zIndex = '10000';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.textAlign = 'center';
        
        // Add fade-in animation
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease-in-out';
        
        // Force reflow to make animation work
        void popup.offsetWidth;
        
        // Fade in
        popup.style.opacity = '1';
        
        // Remove after a short delay
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    document.body.removeChild(popup);
                }
            }, window.CONFIG.COPIED_POPUP_FADE_TIME_MS);
        }, window.CONFIG.COPIED_POPUP_DISPLAY_TIME_MS);
    }
};

