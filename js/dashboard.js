// Dashboard Logic
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in with Firebase
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser && !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // If Firebase user exists but no localStorage data, fetch from Firestore
    if (currentUser && !getUserData()) {
        try {
            const userData = await getUserProfile(currentUser.uid);
            if (userData) {
                saveUserData(userData);
            } else {
                window.location.href = 'login.html';
                return;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    
    // Get current user data
    const user = getCurrentUser();
    
    // Update header
    updateHeader(user);
    
    // Update stats
    updateStats(user);
    
    // Load recent activity
    loadRecentActivity();
    
    // Load active jobs
    loadActiveJobs();
    
    // Setup menu toggle
    setupMenuToggle();
    
    // Setup logout button
    setupLogout();
});

function updateHeader(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('headerCoins').textContent = user.coins;
    document.getElementById('welcomeText').textContent = `Welcome back, ${user.name}!`;
    
    // Update notification badge
    const unreadCount = getUnreadNotificationsCount();
    const badge = document.getElementById('notifBadge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
    
    // Create avatar with emoji or first letter
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';
        avatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();
    }
}

function updateStats(user) {
    document.getElementById('totalCoins').textContent = user.coins.toLocaleString();
    document.getElementById('activeJobs').textContent = user.activeJobs || 0;
    document.getElementById('completedJobs').textContent = user.completedJobs || 0;
    document.getElementById('userRating').textContent = user.rating ? user.rating.toFixed(1) : '0.0';
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const notifications = getNotifications();
    
    if (!activityList) return;
    
    // Show only first 5 notifications
    const recentNotifications = notifications.slice(0, 5);
    
    if (recentNotifications.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-content">
                    <div class="activity-message">No recent activity</div>
                </div>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentNotifications.map(notif => `
        <div class="activity-item">
            <div class="activity-icon">${getNotificationIcon(notif.type)}</div>
            <div class="activity-content">
                <div class="activity-message">${notif.message}</div>
                <div class="activity-time">${notif.time}</div>
            </div>
        </div>
    `).join('');
}

function loadActiveJobs() {
    const jobsSummary = document.getElementById('jobsSummary');
    const activeJobs = getMyActiveJobs();
    
    if (!jobsSummary) return;
    
    if (activeJobs.length === 0) {
        jobsSummary.innerHTML = `
            <div class="job-item">
                <div class="job-info">
                    <div class="job-title">No active jobs</div>
                    <div class="job-meta">Start browsing jobs to find work</div>
                </div>
            </div>
        `;
        return;
    }
    
    jobsSummary.innerHTML = activeJobs.map(job => `
        <div class="job-item">
            <div class="job-info">
                <div class="job-title">${job.title}</div>
                <div class="job-meta">
                    Client: ${job.clientName} • 💰 ${job.coins} coins • Due: ${formatDate(job.deadline)}
                </div>
            </div>
            <div class="job-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${job.progress}%"></div>
                </div>
                <div class="progress-text">${job.progress}% complete</div>
            </div>
        </div>
    `).join('');
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return 'Overdue';
    } else if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Tomorrow';
    } else {
        return `${diffDays} days`;
    }
}

function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (!menuToggle.contains(event.target) && !sidebar.contains(event.target)) {
                    sidebar.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    }
}

function setupLogout() {
    // Find all logout buttons/links
    const logoutBtns = document.querySelectorAll('[onclick*="logout"]');
    logoutBtns.forEach(btn => {
        btn.onclick = async function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                await logout();
            }
        };
    });
}
