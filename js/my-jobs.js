// My Jobs Logic
document.addEventListener('DOMContentLoaded', async function() {
    // Setup tabs
    setupTabs();
    
    // Load jobs from Firestore
    await loadMyJobs();
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

async function loadMyJobs() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        // Fallback to dummy data
        loadActiveJobs();
        loadInProgressJobs();
        loadCompletedJobs();
        return;
    }
    
    const db = getFirestore();
    
    try {
        // Load applications (jobs I applied to)
        const applicationsSnapshot = await db.collection('applications')
            .where('workerId', '==', currentUser.uid)
            .get();
        
        const applicationJobIds = applicationsSnapshot.docs.map(doc => doc.data().jobId);
        
        // Load jobs I posted
        const postedJobsSnapshot = await db.collection('jobs')
            .where('clientId', '==', currentUser.uid)
            .get();
        
        const appliedJobs = [];
        const postedJobs = [];
        
        // Get job details for applications
        for (const jobId of applicationJobIds) {
            const jobDoc = await db.collection('jobs').doc(jobId).get();
            if (jobDoc.exists) {
                appliedJobs.push({ id: jobDoc.id, ...jobDoc.data() });
            }
        }
        
        // Get posted jobs
        postedJobsSnapshot.docs.forEach(doc => {
            postedJobs.push({ id: doc.id, ...doc.data() });
        });
        
        // Display jobs
        displayActiveJobs(appliedJobs.filter(j => j.status === 'open'));
        displayInProgressJobs(appliedJobs.filter(j => j.status === 'in_progress'));
        displayCompletedJobs(appliedJobs.filter(j => j.status === 'completed'));
        displayPostedJobs(postedJobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        // Fallback to dummy data
        loadActiveJobs();
        loadInProgressJobs();
        loadCompletedJobs();
    }
}

function displayActiveJobs(jobs) {
    const container = document.getElementById('activeJobsList');
    
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
    
    container.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

function displayInProgressJobs(jobs) {
    const container = document.getElementById('inProgressJobsList');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No jobs in progress</h3>
                <p style="color: var(--text-secondary);">
                    Once you start working on a job, it will appear here
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createJobCard(job, true)).join('');
}

function displayCompletedJobs(jobs) {
    const container = document.getElementById('completedJobsList');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No completed jobs</h3>
                <p style="color: var(--text-secondary);">
                    Completed jobs will appear here
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

function displayPostedJobs(jobs) {
    const container = document.getElementById('postedJobsList');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                <h3>No posted jobs</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
                    Post a job to hire workers
                </p>
                <a href="post-job.html" class="btn btn-primary">Post a Job</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => createPostedJobCard(job)).join('');
}

function createJobCard(job, showProgress = false) {
    const progressBar = showProgress && job.progress ? `
        <div class="job-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${job.progress}%"></div>
            </div>
            <div class="progress-text">${job.progress}% complete</div>
        </div>
    ` : '';
    
    return `
        <div class="job-card-item">
            <div class="job-card-header">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-coins">${job.coins} <i class="fas fa-coins"></i></div>
            </div>
            <div class="job-meta">
                <span><i class="fas fa-user"></i> ${job.clientName || 'Client'}</span>
                <span><i class="far fa-calendar"></i> Due: ${job.deadline}</span>
                <span class="status-badge status-${job.status}">${job.status}</span>
            </div>
            ${progressBar}
            <div class="job-actions">
                <a href="job-details.html?id=${job.id}" class="btn btn-outline btn-small">View Details</a>
                ${showProgress ? `<a href="submit-work.html?id=${job.id}" class="btn btn-primary btn-small">Submit Work</a>` : ''}
            </div>
        </div>
    `;
}

function createPostedJobCard(job) {
    return `
        <div class="job-card-item">
            <div class="job-card-header">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-coins">${job.coins} <i class="fas fa-coins"></i></div>
            </div>
            <div class="job-meta">
                <span><i class="fas fa-file-alt"></i> ${job.applications || 0} applications</span>
                <span><i class="far fa-calendar"></i> Posted: ${job.postedDate}</span>
                <span class="status-badge status-${job.status}">${job.status}</span>
            </div>
            <div class="job-actions">
                <a href="job-details.html?id=${job.id}" class="btn btn-outline btn-small">View Details</a>
                <button class="btn btn-primary btn-small" onclick="viewApplications('${job.id}')">View Applications</button>
            </div>
        </div>
    `;
}

function viewApplications(jobId) {
    // Redirect to job details to view applications
    window.location.href = `job-details.html?id=${jobId}&tab=applications`;
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
