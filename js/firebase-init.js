// Firebase Initialization Module
// This module initializes Firebase and provides helper functions for Firebase services

// Initialize Firebase only once
let firebaseInitialized = false;
let auth, db, storage, messaging;

function initializeFirebase() {
    if (firebaseInitialized) {
        return;
    }

    try {
        const firebaseConfig = {
            apiKey: "AIzaSyBt5enDVu9T_WVP3iJw_eOBc9dKrLME_Xo",
            authDomain: "skillexchange-706.firebaseapp.com",
            databaseURL: "https://skillexchange-706-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "skillexchange-706",
            storageBucket: "skillexchange-706.firebasestorage.app",
            messagingSenderId: "853922656544",
            appId: "1:853922656544:web:90a547a7a09a771b9ce745"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Initialize Firebase services
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();

        // Initialize messaging if supported
        if (firebase.messaging.isSupported()) {
            messaging = firebase.messaging();
        }

        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// Helper Functions
function getAuth() {
    if (!firebaseInitialized) initializeFirebase();
    return auth;
}

function getFirestore() {
    if (!firebaseInitialized) initializeFirebase();
    return db;
}

function getStorage() {
    if (!firebaseInitialized) initializeFirebase();
    return storage;
}

function getMessaging() {
    if (!firebaseInitialized) initializeFirebase();
    return messaging;
}

function getCurrentFirebaseUser() {
    if (!firebaseInitialized) initializeFirebase();
    return auth ? auth.currentUser : null;
}

function isUserLoggedIn() {
    return getCurrentFirebaseUser() !== null;
}

// Export functions for use in other modules
window.initializeFirebase = initializeFirebase;
window.getAuth = getAuth;
window.getFirestore = getFirestore;
window.getStorage = getStorage;
window.getMessaging = getMessaging;
window.getCurrentFirebaseUser = getCurrentFirebaseUser;
window.isUserLoggedIn = isUserLoggedIn;

// Auto-initialize on script load
if (typeof firebase !== 'undefined') {
    initializeFirebase();
}
