// Profile Logic
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    // Update profile info
    updateProfile(user);
});

function updateProfile(user) {
    // Basic info
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileRole').textContent = user.role === 'worker' ? '💼 Worker' : '📝 Client';
    
    // Avatar
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        avatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();
    }
    
    // Stats
    document.getElementById('statRating').textContent = user.rating ? user.rating.toFixed(1) : '0.0';
    document.getElementById('statCompleted').textContent = user.completedJobs || 0;
    document.getElementById('statEarned').textContent = (user.earnedCoins || 0).toLocaleString();
    
    // Skills
    loadSkills(user.skills || []);
    
    // Recent work
    loadRecentWork();
}

function loadSkills(skills) {
    const container = document.getElementById('skillsContainer');
    
    if (!container) return;
    
    if (skills.length === 0) {
        skills = ['Web Development', 'JavaScript', 'React', 'CSS'];
    }
    
    container.innerHTML = skills.map(skill => `
        <span class="skill-tag">${skill}</span>
    `).join('');
}

function loadRecentWork() {
    const container = document.getElementById('recentWorkList');
    
    if (!container) return;
    
    // Simulated recent work
    const recentWork = [
        {
            title: 'Website Redesign Project',
            client: 'Alice Smith',
            completedDate: '2024-02-10',
            rating: 5.0
        },
        {
            title: 'Mobile App UI Design',
            client: 'Bob Johnson',
            completedDate: '2024-02-05',
            rating: 4.5
        },
        {
            title: 'Logo Design',
            client: 'Carol White',
            completedDate: '2024-01-28',
            rating: 5.0
        }
    ];
    
    container.innerHTML = recentWork.map(work => `
        <div class="work-item">
            <div class="work-info">
                <h4>${work.title}</h4>
                <div class="work-meta">Client: ${work.client} • Completed: ${work.completedDate}</div>
            </div>
            <div class="work-rating">
                <div style="color: var(--accent-color); font-size: var(--font-size-lg); font-weight: 700;">
                    ⭐ ${work.rating}
                </div>
            </div>
        </div>
    `).join('');
}

function editProfile() {
    alert('Edit Profile feature is UI only.\n\nIn a real application, this would open a form to edit your profile information.');
}
