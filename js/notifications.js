// Notifications Logic
document.addEventListener('DOMContentLoaded', async function() {
    await initializeFCM();
    await loadNotificationsFromFirestore();
});

// Initialize Firebase Cloud Messaging
async function initializeFCM() {
    try {
        const messaging = getMessaging();
        
        if (!messaging) {
            console.log('Firebase Messaging not supported in this browser');
            return;
        }
        
        // Request notification permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            
            // Get FCM token
            // Note: Replace with your VAPID key from Firebase Console
            // Project Settings > Cloud Messaging > Web Push certificates
            const token = await messaging.getToken({
                vapidKey: 'BNxxx...' // TODO: Replace with your actual VAPID key
            });
            
            if (token) {
                console.log('FCM Token:', token);
                // Save token to Firestore
                await saveFCMToken(token);
            }
        } else {
            console.log('Notification permission denied.');
        }
        
        // Handle foreground messages
        messaging.onMessage((payload) => {
            console.log('Message received:', payload);
            
            // Show notification
            if (Notification.permission === 'granted') {
                new Notification(payload.notification.title, {
                    body: payload.notification.body,
                    icon: '/favicon.ico'
                });
            }
            
            // Reload notifications
            loadNotificationsFromFirestore();
        });
    } catch (error) {
        console.error('Error initializing FCM:', error);
    }
}

async function saveFCMToken(token) {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) return;
    
    const db = getFirestore();
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            fcmToken: token,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving FCM token:', error);
    }
}

async function loadNotificationsFromFirestore() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const container = document.getElementById('notificationsList');
    
    if (!currentUser || !container) {
        loadNotifications();
        return;
    }
    
    const db = getFirestore();
    
    try {
        const snapshot = await db.collection('notifications')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = `
                <div class="empty-notifications">
                    <div class="empty-icon"><i class="fas fa-bell"></i></div>
                    <h3>No notifications</h3>
                    <p>You're all caught up! New notifications will appear here.</p>
                </div>
            `;
            return;
        }
        
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        container.innerHTML = notifications.map(notification => createNotificationItem(notification)).join('');
        
        // Add click handlers
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                const notifId = this.dataset.notifId;
                handleNotificationClick(notifId);
            });
        });
    } catch (error) {
        console.error('Error loading notifications:', error);
        loadNotifications();
    }
}

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
        'application': '<i class="fas fa-file-alt"></i>',
        'payment': '<i class="fas fa-coins"></i>',
        'approval': '<i class="fas fa-check-circle"></i>',
        'reminder': '<i class="far fa-clock"></i>',
        'message': '<i class="fas fa-comment"></i>'
    };
    return icons[type] || '<i class="fas fa-bell"></i>';
}

async function handleNotificationClick(notifId) {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) return;
    
    const db = getFirestore();
    
    try {
        // Mark as read in Firestore
        await db.collection('notifications').doc(notifId).update({
            read: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Reload notifications
        await loadNotificationsFromFirestore();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

async function markAllAsRead() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        alert('Please login to mark notifications as read');
        return;
    }
    
    const db = getFirestore();
    
    try {
        // Get all unread notifications
        const snapshot = await db.collection('notifications')
            .where('userId', '==', currentUser.uid)
            .where('read', '==', false)
            .get();
        
        if (snapshot.empty) {
            alert('All notifications are already read!');
            return;
        }
        
        // Mark all as read
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { 
                read: true,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        
        await batch.commit();
        
        alert(`✅ Marked ${snapshot.size} notification(s) as read`);
        
        // Reload notifications
        await loadNotificationsFromFirestore();
    } catch (error) {
        console.error('Error marking all as read:', error);
        alert('❌ Failed to mark notifications as read');
    }
}
