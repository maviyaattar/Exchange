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

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestBtn = document.getElementById('guestBtn');
    
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
                activeJobs: 0
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
            const role = document.querySelector('input[name="role"]:checked').value;
            
            // Simulate registration
            const userData = {
                name: name,
                email: email,
                role: role,
                coins: role === 'client' ? 5000 : 0, // Clients get starting coins
                avatar: '👤',
                rating: 0,
                completedJobs: 0,
                activeJobs: 0
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
                activeJobs: 0
            };
            
            saveUserData(userData);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
});
