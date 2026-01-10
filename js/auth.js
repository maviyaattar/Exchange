// Authentication Logic (UI Only - No Real Authentication)

// Store user data in localStorage
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

function logout() {
    localStorage.removeItem('workcoin_logged_in');
    window.location.href = '../index.html';
}

// Google Sign-In Handler
async function handleGoogleSignIn(isSignUp = false) {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.error('Firebase not loaded, using mock authentication');
            // Mock Google Sign-In
            const userData = {
                name: 'Google User',
                email: 'user@gmail.com',
                role: 'worker',
                coins: 1000,
                avatar: '👤',
                rating: 4.5,
                completedJobs: 0,
                activeJobs: 0,
                authMethod: 'google'
            };
            saveUserData(userData);
            alert(isSignUp ? 'Account created with Google!' : 'Signed in with Google!');
            window.location.href = 'dashboard.html';
            return;
        }

        // Real Google Sign-In with Firebase
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        const userData = {
            name: user.displayName || 'Google User',
            email: user.email,
            role: 'worker',
            coins: isSignUp ? 1000 : (getUserData()?.coins || 1000),
            avatar: user.photoURL || '👤',
            rating: getUserData()?.rating || 0,
            completedJobs: getUserData()?.completedJobs || 0,
            activeJobs: getUserData()?.activeJobs || 0,
            authMethod: 'google',
            uid: user.uid
        };
        
        saveUserData(userData);
        alert(isSignUp ? 'Account created with Google!' : 'Signed in with Google!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Google Sign-In failed. Please try again.');
    }
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestBtn = document.getElementById('guestBtn');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Simulate login (no real authentication)
            const userData = {
                name: email.split('@')[0],
                email: email,
                role: 'worker', // Default role
                coins: 1000,
                avatar: '👤',
                rating: 4.5,
                completedJobs: 0,
                activeJobs: 0,
                authMethod: 'email'
            };
            
            saveUserData(userData);
            
            // Show success message
            alert('Login successful!');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            // Role is no longer selected - default to 'worker'
            const role = 'worker';
            
            // Simulate registration
            const userData = {
                name: name,
                email: email,
                role: role,
                coins: 1000, // All users start with 1000 coins
                avatar: '👤',
                rating: 0,
                completedJobs: 0,
                activeJobs: 0,
                authMethod: 'email'
            };
            
            saveUserData(userData);
            
            // Show success message
            alert('Registration successful! Welcome to WorkCoin!');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    if (guestBtn) {
        guestBtn.addEventListener('click', function() {
            // Create guest user
            const userData = {
                name: 'Guest User',
                email: 'guest@workcoin.com',
                role: 'worker',
                coins: 500,
                avatar: '👤',
                rating: 0,
                completedJobs: 0,
                activeJobs: 0,
                authMethod: 'guest'
            };
            
            saveUserData(userData);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Google Sign-In button (Login page)
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', function() {
            handleGoogleSignIn(false);
        });
    }
    
    // Google Sign-Up button (Register page)
    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', function() {
            handleGoogleSignIn(true);
        });
    }
});
