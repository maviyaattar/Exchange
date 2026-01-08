// My Jobs Logic
document.addEventListener('DOMContentLoaded', function() {
    // Setup tabs
    setupTabs();
    
    // Load jobs
    loadActiveJobs();
    loadInProgressJobs();
    loadCompletedJobs();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function loadActiveJobs() {
    const container = document.getElementById('activeJobsList');
    const jobs = getMyActiveJobs().filter(job => job.status !== 'in_progress');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No active jobs</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
                    Jobs you apply to will appear here
                </p>
                <a href="browse-jobs.html" class="btn btn-primary">Browse Jobs</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createMyJobCard(job, 'active')).join('');
}

function loadInProgressJobs() {
    const container = document.getElementById('inProgressJobsList');
    const jobs = getMyActiveJobs().filter(job => job.status === 'in_progress');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No jobs in progress</h3>
                <p style="color: var(--text-secondary);">
                    Accepted jobs will appear here
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createMyJobCard(job, 'in_progress')).join('');
}

function loadCompletedJobs() {
    const container = document.getElementById('completedJobsList');
    
    if (!container) return;
    
    // Simulated completed jobs
    const completedJobs = [
        {
            id: 301,
            title: 'Website Redesign Project',
            coins: 750,
            status: 'completed',
            clientName: 'Alice Smith',
            completedDate: '2024-02-10',
            rating: 5
        },
        {
            id: 302,
            title: 'Mobile App UI Design',
            coins: 600,
            status: 'completed',
            clientName: 'Bob Johnson',
            completedDate: '2024-02-05',
            rating: 4.5
        }
    ];
    
    if (completedJobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No completed jobs yet</h3>
                <p style="color: var(--text-secondary);">
                    Completed jobs will appear here
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = completedJobs.map(job => createCompletedJobCard(job)).join('');
}

function createMyJobCard(job, status) {
    let actions = '';
    
    if (status === 'active') {
        actions = `
            <div class="my-job-actions">
                <button class="btn btn-outline btn-small" onclick="viewJobDetails(${job.id})">View Details</button>
            </div>
        `;
    } else if (status === 'in_progress') {
        actions = `
            <div style="margin-bottom: var(--spacing-md);">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${job.progress}%"></div>
                </div>
                <div class="progress-text" style="text-align: center; margin-top: var(--spacing-xs);">
                    ${job.progress}% complete
                </div>
            </div>
            <div class="my-job-actions">
                <button class="btn btn-primary btn-small" onclick="submitWork(${job.id})">Submit Work</button>
                <button class="btn btn-outline btn-small" onclick="viewJobDetails(${job.id})">View Details</button>
            </div>
        `;
    }
    
    return `
        <div class="my-job-card">
            <div class="my-job-header">
                <div class="my-job-title">
                    <h4>${job.title}</h4>
                    <p style="color: var(--text-secondary); font-size: var(--font-size-sm); margin: 0;">
                        Client: ${job.clientName}
                    </p>
                </div>
                <div class="my-job-status">
                    <span class="badge badge-${status === 'in_progress' ? 'warning' : 'primary'}">
                        ${status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div class="my-job-info">
                <div>
                    <div class="info-label">Payment</div>
                    <div class="info-value" style="color: var(--accent-color);">${job.coins} 💰</div>
                </div>
                <div>
                    <div class="info-label">Deadline</div>
                    <div class="info-value">${job.deadline}</div>
                </div>
                <div>
                    <div class="info-label">Assigned</div>
                    <div class="info-value">${job.assignedDate}</div>
                </div>
            </div>
            
            ${actions}
        </div>
    `;
}

function createCompletedJobCard(job) {
    return `
        <div class="my-job-card">
            <div class="my-job-header">
                <div class="my-job-title">
                    <h4>${job.title}</h4>
                    <p style="color: var(--text-secondary); font-size: var(--font-size-sm); margin: 0;">
                        Client: ${job.clientName}
                    </p>
                </div>
                <div class="my-job-status">
                    <span class="badge badge-success">COMPLETED</span>
                </div>
            </div>
            
            <div class="my-job-info">
                <div>
                    <div class="info-label">Earned</div>
                    <div class="info-value" style="color: var(--success-color);">+${job.coins} 💰</div>
                </div>
                <div>
                    <div class="info-label">Completed</div>
                    <div class="info-value">${job.completedDate}</div>
                </div>
                <div>
                    <div class="info-label">Rating</div>
                    <div class="info-value">⭐ ${job.rating}</div>
                </div>
            </div>
        </div>
    `;
}

function viewJobDetails(jobId) {
    window.location.href = `job-details.html?id=${jobId}`;
}

function submitWork(jobId) {
    window.location.href = `submit-work.html?id=${jobId}`;
}
