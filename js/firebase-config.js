// Firebase Configuration
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
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();
const storage = firebase.storage();

// Helper function to get current user
function getCurrentFirebaseUser() {
    return auth.currentUser;
}

// Helper function to check if user is logged in
function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseRtdb = rtdb;
window.firebaseStorage = storage;
