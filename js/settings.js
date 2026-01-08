// Settings Logic
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    // Update user email display
    if (user) {
        const emailDisplay = document.getElementById('userEmail');
        if (emailDisplay) {
            emailDisplay.textContent = user.email;
        }
    }
    
    // Setup event listeners
    setupSettingsListeners();
});

function setupSettingsListeners() {
    // Theme selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            if (this.value !== 'light') {
                alert('This theme is coming soon!');
                this.value = 'light';
            }
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            if (this.value !== 'en') {
                alert('This language is coming soon!');
                this.value = 'en';
            }
        });
    }
    
    // Notification toggles
    const emailNotif = document.getElementById('emailNotif');
    const jobAppNotif = document.getElementById('jobAppNotif');
    const paymentNotif = document.getElementById('paymentNotif');
    
    [emailNotif, jobAppNotif, paymentNotif].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', function() {
                const label = this.parentElement.parentElement.querySelector('.setting-label').textContent;
                const status = this.checked ? 'enabled' : 'disabled';
                alert(`${label} ${status}`);
            });
        }
    });
}

function changeEmail() {
    const newEmail = prompt('Enter your new email address:');
    
    if (newEmail && newEmail.includes('@')) {
        const user = getCurrentUser();
        user.email = newEmail;
        localStorage.setItem('workcoin_user', JSON.stringify(user));
        
        alert('✅ Email updated successfully!');
        
        // Update display
        document.getElementById('userEmail').textContent = newEmail;
    } else if (newEmail !== null) {
        alert('Please enter a valid email address');
    }
}

function changePassword() {
    alert('Change Password\n\n' +
          'This is a UI-only feature.\n\n' +
          'In a real application, you would:\n' +
          '1. Verify current password\n' +
          '2. Enter new password\n' +
          '3. Confirm new password\n' +
          '4. Update password securely on the server');
}

function enable2FA() {
    alert('Two-Factor Authentication\n\n' +
          'This is a UI-only feature.\n\n' +
          'In a real application, you would:\n' +
          '1. Set up authenticator app\n' +
          '2. Scan QR code\n' +
          '3. Verify with 6-digit code\n' +
          '4. Save backup codes');
}

function deleteAccount() {
    const confirmed = confirm(
        '⚠️ Delete Account?\n\n' +
        'This action cannot be undone. All your data, including:\n' +
        '- Profile information\n' +
        '- Job history\n' +
        '- Coins and transactions\n' +
        'Will be permanently deleted.\n\n' +
        'Are you sure you want to continue?'
    );
    
    if (confirmed) {
        const doubleConfirm = confirm(
            'Final confirmation:\n\n' +
            'Type DELETE to confirm account deletion.\n\n' +
            'This is your last chance to cancel.'
        );
        
        if (doubleConfirm) {
            alert('Account deletion initiated.\n\n' +
                  'In a real application, your account would be deleted.\n\n' +
                  'For this demo, we\'ll just log you out.');
            
            handleLogout();
        }
    }
}

function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (confirmed) {
        // Clear user data
        localStorage.removeItem('workcoin_logged_in');
        localStorage.removeItem('workcoin_user');
        
        // Redirect to landing page
        window.location.href = '../index.html';
    }
}
