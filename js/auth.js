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

// Helper function to show error messages
function showError(message) {
    alert('❌ Error: ' + message);
}

// Helper function to show success messages
function showSuccess(message) {
    alert('✅ ' + message);
}

// Create user profile in Firestore
async function createUserProfile(user, additionalData = {}) {
    const db = getFirestore();
    const userRef = db.collection('users').doc(user.uid);
    
    const userData = {
        uid: user.uid,
        email: user.email,
        name: additionalData.name || user.displayName || user.email.split('@')[0],
        role: additionalData.role || 'worker',
        coins: additionalData.role === 'client' ? 5000 : 0,
        lockedCoins: 0,
        earnedCoins: 0,
        rating: 0,
        completedJobs: 0,
        activeJobs: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await userRef.set(userData);
        return userData;
    } catch (error) {
        console.error('Error creating user profile:', error);
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
        console.error('Error getting user profile:', error);
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
        console.error('Logout error:', error);
        showError('Failed to logout. Please try again.');
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
                console.error('Login error:', error);
                hideLoading(submitBtn);
                
                // Handle specific error codes
                if (error.code === 'auth/user-not-found') {
                    showError('No account found with this email. Please register first.');
                } else if (error.code === 'auth/wrong-password') {
                    showError('Incorrect password. Please try again.');
                } else if (error.code === 'auth/invalid-email') {
                    showError('Invalid email address.');
                } else if (error.code === 'auth/too-many-requests') {
                    showError('Too many failed login attempts. Please try again later.');
                } else {
                    showError(error.message || 'Login failed. Please try again.');
                }
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            
            // Validate password length
            if (password.length < 6) {
                showError('Password must be at least 6 characters long.');
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
                showSuccess('Registration successful! Welcome to WorkCoin!');
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Registration error:', error);
                hideLoading(submitBtn);
                
                // Handle specific error codes
                if (error.code === 'auth/email-already-in-use') {
                    showError('An account with this email already exists. Please login instead.');
                } else if (error.code === 'auth/invalid-email') {
                    showError('Invalid email address.');
                } else if (error.code === 'auth/weak-password') {
                    showError('Password is too weak. Please use a stronger password.');
                } else {
                    showError(error.message || 'Registration failed. Please try again.');
                }
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
                
                userData.coins = 500; // Give guest some starting coins
                
                // Update the profile with starting coins
                const db = getFirestore();
                await db.collection('users').doc(user.uid).update({
                    coins: 500
                });
                
                saveUserData(userData);
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Guest login error:', error);
                hideLoading(guestBtn);
                showError('Failed to continue as guest. Please try again.');
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
