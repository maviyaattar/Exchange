// Firebase Cloud Messaging Service Worker

// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Note: In production, Firebase configuration should be loaded from
// environment variables or a secure configuration service.
// The API key here is safe to expose as it's meant for client-side use,
// but should be protected by Firebase Security Rules and proper domain restrictions.

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyBt5enDVu9T_WVP3iJw_eOBc9dKrLME_Xo",
    authDomain: "skillexchange-706.firebaseapp.com",
    databaseURL: "https://skillexchange-706-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skillexchange-706",
    storageBucket: "skillexchange-706.firebasestorage.app",
    messagingSenderId: "853922656544",
    appId: "1:853922656544:web:90a547a7a09a771b9ce745"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title || 'WorkCoin Notification';
    const notificationOptions = {
        body: payload.notification.body || 'You have a new notification',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');
    
    event.notification.close();
    
    // Open the app or focus existing window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If there's already a window open, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/pages/notifications.html');
            }
        })
    );
});
