// Notifications Logic
document.addEventListener('DOMContentLoaded', function() {
    loadNotifications();
});

function loadNotifications() {
    const container = document.getElementById('notificationsList');
    const notifications = getNotifications();
    
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-notifications">
                <div class="empty-icon">🔔</div>
                <h3>No notifications</h3>
                <p>You're all caught up! New notifications will appear here.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notification => createNotificationItem(notification)).join('');
    
    // Add click handlers
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const notifId = parseInt(this.dataset.notifId);
            handleNotificationClick(notifId);
        });
    });
}

function createNotificationItem(notification) {
    const icon = getNotificationIcon(notification.type);
    const unreadClass = notification.read ? '' : 'unread';
    
    let actions = '';
    if (notification.jobId) {
        actions = `
            <div class="notification-actions">
                <a href="job-details.html?id=${notification.jobId}" class="notification-link">
                    View Job →
                </a>
            </div>
        `;
    }
    
    return `
        <div class="notification-item ${unreadClass}" data-notif-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                ${icon}
            </div>
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
                ${actions}
            </div>
        </div>
    `;
}

function getNotificationIcon(type) {
    const icons = {
        'application': '📋',
        'payment': '💰',
        'approval': '✅',
        'reminder': '⏰',
        'message': '💬'
    };
    return icons[type] || '📢';
}

function handleNotificationClick(notifId) {
    // Mark as read (UI simulation)
    const notifications = getNotifications();
    const notification = notifications.find(n => n.id === notifId);
    
    if (notification && !notification.read) {
        notification.read = true;
        // In a real app, would update backend
        loadNotifications();
    }
}

function markAllAsRead() {
    const notifications = getNotifications();
    let unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount === 0) {
        alert('All notifications are already read!');
        return;
    }
    
    // Mark all as read (UI simulation)
    notifications.forEach(n => n.read = true);
    
    alert(`✅ Marked ${unreadCount} notification(s) as read`);
    
    // Reload
    loadNotifications();
}
