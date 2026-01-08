// Authentication Logic with Firebase

// Helper function to show loading state
function showLoading(button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Loading...';
}

function hideLoading(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
}

// Alert System - Create styled alerts instead of using browser alert()
function createAlertContainer() {
    let container = document.getElementById('alert-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-container';
        container.className = 'alert-container';
        document.body.appendChild(container);
    }
    return container;
}

function showAlert(title, message, type = 'info') {
    const container = createAlertContainer();
    
    // Icon based on type
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    // Create alert structure safely to prevent XSS
    alertDiv.innerHTML = `
        <div class="alert-icon">${icons[type]}</div>
        <div class="alert-content">
            <div class="alert-title"></div>
            <div class="alert-message"></div>
        </div>
        <button class="alert-close" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Set text content safely (prevents XSS)
    const titleElement = alertDiv.querySelector('.alert-title');
    const messageElement = alertDiv.querySelector('.alert-message');
    titleElement.textContent = title;
    if (message) {
        messageElement.textContent = message;
    } else {
        messageElement.style.display = 'none';
    }
    
    // Add close functionality
    const closeBtn = alertDiv.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 300);
    });
    
    container.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Helper function to show error messages
function showError(message, details = '') {
    showAlert('Error', details || message, 'error');
}

// Helper function to show success messages
function showSuccess(message) {
    showAlert('Success', message, 'success');
}

// Create user profile in Firestore
async function createUserProfile(user, additionalData = {}) {
    const db = getFirestore();
    const userRef = db.collection('users').doc(user.uid);
    
    // Check if profile already exists
    try {
        const existingProfile = await userRef.get();
        if (existingProfile.exists) {
            return existingProfile.data();
        }
    } catch (error) {
        console.log('Checking existing profile:', error);
    }
    
    const userData = {
        uid: user.uid,
        email: user.email,
        name: additionalData.name || user.displayName || user.email.split('@')[0],
        role: additionalData.role || 'worker', // Default to worker role
        coins: 0, // All new users start with 0 coins
        lockedCoins: 0,
        earnedCoins: 0,
        rating: 0,
        completedJobs: 0,
        activeJobs: 0,
        photoURL: user.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await userRef.set(userData);
        return userData;
    } catch (error) {
        showError('Failed to create user profile', error.message);
        throw error;
    }
}

// Get user profile from Firestore
async function getUserProfile(uid) {
    const db = getFirestore();
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        showError('Failed to get user profile', error.message);
        throw error;
    }
}

// Save user data to localStorage (for quick access)
function saveUserData(userData) {
    localStorage.setItem('workcoin_user', JSON.stringify(userData));
    localStorage.setItem('workcoin_logged_in', 'true');
}

function getUserData() {
    const userData = localStorage.getItem('workcoin_user');
    return userData ? JSON.parse(userData) : null;
}

function isLoggedIn() {
    return localStorage.getItem('workcoin_logged_in') === 'true';
}

function clearUserData() {
    localStorage.removeItem('workcoin_user');
    localStorage.removeItem('workcoin_logged_in');
}

async function logout() {
    const auth = getAuth();
    try {
        await auth.signOut();
        clearUserData();
        window.location.href = '../index.html';
    } catch (error) {
        showError('Failed to logout', error.message);
    }
}

// Setup authentication state observer
function setupAuthStateObserver() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            const userData = await getUserProfile(user.uid);
            if (userData) {
                saveUserData(userData);
            }
        } else {
            // User is signed out
            console.log('User signed out');
            clearUserData();
        }
    });
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Setup auth state observer
    setupAuthStateObserver();
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestBtn = document.getElementById('guestBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            showLoading(submitBtn);
            
            try {
                const auth = getAuth();
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Get user profile from Firestore
                const userData = await getUserProfile(user.uid);
                
                if (userData) {
                    saveUserData(userData);
                    showSuccess('Login successful!');
                    window.location.href = 'dashboard.html';
                } else {
                    throw new Error('User profile not found');
                }
            } catch (error) {
                hideLoading(submitBtn);
                
                // Handle specific error codes with detailed messages
                let errorTitle = 'Login Failed';
                let errorMessage = '';
                
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No account found with this email. Please register first.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password. Please try again.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address format.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed login attempts. Please try again later.';
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled.';
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your connection.';
                } else {
                    errorMessage = error.message || 'An unexpected error occurred. Please try again.';
                }
                
                showError(errorTitle, errorMessage);
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // Default all users to worker role for simplified onboarding
            const role = 'worker';
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            
            // Validate password length
            if (password.length < 6) {
                showError('Password Too Short', 'Password must be at least 6 characters long.');
                return;
            }
            
            showLoading(submitBtn);
            
            try {
                const auth = getAuth();
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update display name
                await user.updateProfile({
                    displayName: name
                });
                
                // Create user profile in Firestore
                const userData = await createUserProfile(user, { name, role });
                
                saveUserData(userData);
                showSuccess('Welcome to WorkCoin! Your account has been created successfully.');
                
                // Redirect after a short delay to show success message
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } catch (error) {
                hideLoading(submitBtn);
                
                // Handle specific error codes with detailed messages
                let errorTitle = 'Registration Failed';
                let errorMessage = '';
                
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'An account with this email already exists. Please login instead.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address format.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password is too weak. Please use a stronger password with letters, numbers, and symbols.';
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your connection.';
                } else if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = 'Email/password authentication is not enabled. Please contact support.';
                } else {
                    errorMessage = error.message || 'An unexpected error occurred. Please try again.';
                }
                
                showError(errorTitle, errorMessage);
            }
        });
    }
    
    if (guestBtn) {
        guestBtn.addEventListener('click', async function() {
            showLoading(guestBtn);
            
            try {
                const auth = getAuth();
                // Sign in anonymously as guest
                const userCredential = await auth.signInAnonymously();
                const user = userCredential.user;
                
                // Create guest user profile
                const userData = await createUserProfile(user, {
                    name: 'Guest User',
                    role: 'worker'
                });
                
                // Give guest some starting coins
                userData.coins = 500;
                
                // Update the profile with starting coins
                const db = getFirestore();
                await db.collection('users').doc(user.uid).update({
                    coins: 500
                });
                
                saveUserData(userData);
                showSuccess('Welcome! You are signed in as a guest.');
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } catch (error) {
                hideLoading(guestBtn);
                showError('Guest Login Failed', error.message || 'Failed to continue as guest. Please try again.');
            }
        });
    }
    
    // Google Sign-In Button Handler
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async function() {
            showLoading(googleSignInBtn);
            
            try {
                const auth = getAuth();
                const provider = new firebase.auth.GoogleAuthProvider();
                
                // Request additional scopes if needed
                provider.addScope('profile');
                provider.addScope('email');
                
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                
                // Create or get user profile
                const userData = await createUserProfile(user, {
                    name: user.displayName,
                    role: 'worker'
                });
                
                saveUserData(userData);
                
                // Check if this is a new user
                const isNewUser = result.additionalUserInfo?.isNewUser;
                if (isNewUser) {
                    showSuccess('Welcome to WorkCoin! Your account has been created successfully.');
                } else {
                    showSuccess('Welcome back!');
                }
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } catch (error) {
                hideLoading(googleSignInBtn);
                
                let errorTitle = 'Google Sign-In Failed';
                let errorMessage = '';
                
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'Sign-in popup was closed. Please try again.';
                } else if (error.code === 'auth/popup-blocked') {
                    errorMessage = 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
                } else if (error.code === 'auth/cancelled-popup-request') {
                    errorMessage = 'Sign-in was cancelled. Please try again.';
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    errorMessage = 'An account already exists with the same email but different sign-in method. Please use your original sign-in method.';
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your connection.';
                } else {
                    errorMessage = error.message || 'An unexpected error occurred. Please try again.';
                }
                
                showError(errorTitle, errorMessage);
            }
        });
    }
});

// Export functions for use in other modules
window.logout = logout;
window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.isLoggedIn = isLoggedIn;
window.getUserProfile = getUserProfile;
