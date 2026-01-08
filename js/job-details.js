// Job Details Logic
document.addEventListener('DOMContentLoaded', function() {
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
        showError('Job not found');
        return;
    }
    
    // Load job details
    const job = getJobById(jobId);
    
    if (!job) {
        showError('Job not found');
        return;
    }
    
    displayJobDetails(job);
});

function displayJobDetails(job) {
    const container = document.getElementById('jobDetailsContainer');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="job-details-main">
            <div class="job-details-header">
                <h1>${job.title}</h1>
                <div class="job-details-meta">
                    <span class="job-card-tag">${job.categoryIcon} ${job.category}</span>
                    <span class="job-card-tag">📅 Posted ${job.postedDate}</span>
                    <span class="job-card-tag">⏰ ${job.daysLeft} days left</span>
                    <span class="badge badge-success">${job.status.toUpperCase()}</span>
                </div>
            </div>
            
            <div class="job-details-section">
                <h3>Description</h3>
                <p>${job.fullDescription}</p>
            </div>
            
            <div class="job-details-section">
                <h3>Deliverables</h3>
                <ul class="deliverables-list">
                    ${job.deliverables.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
            
            <div class="job-details-section">
                <h3>Requirements</h3>
                <p>The ideal candidate should have experience in ${job.category} and be able to deliver high-quality work within the specified deadline.</p>
            </div>
        </div>
        
        <div class="job-details-sidebar">
            <div class="sidebar-card">
                <h3>Job Information</h3>
                <div class="info-row">
                    <span class="info-label">Payment</span>
                    <span class="info-value" style="color: var(--accent-color); font-size: var(--font-size-xl);">
                        ${job.coins} 💰
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Deadline</span>
                    <span class="info-value">${job.deadline}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Applications</span>
                    <span class="info-value">${job.applications}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Category</span>
                    <span class="info-value">${job.category}</span>
                </div>
            </div>
            
            <div class="sidebar-card">
                <h3>Client Information</h3>
                <div class="client-info">
                    <div class="client-avatar">👤</div>
                    <div class="client-details">
                        <h4>${job.clientName}</h4>
                        <div class="client-rating">⭐ ${job.clientRating} rating</div>
                    </div>
                </div>
                <p style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                    Trusted client with a history of successful projects.
                </p>
            </div>
            
            <button class="btn btn-primary btn-block btn-large" onclick="applyToJob(${job.id})">
                Apply for this Job
            </button>
            
            <button class="btn btn-outline btn-block" onclick="saveJob(${job.id})">
                💾 Save Job
            </button>
        </div>
    `;
}

function applyToJob(jobId) {
    const job = getJobById(jobId);
    if (!job) return;
    
    const confirmed = confirm(`Apply to "${job.title}" for ${job.coins} coins?\n\nYou will be notified if the client accepts your application.`);
    
    if (confirmed) {
        alert('✅ Application submitted successfully!\n\nThe client will review your application and contact you if selected.');
        
        // Update applications count
        job.applications += 1;
        
        // Redirect to my jobs
        setTimeout(() => {
            window.location.href = 'my-jobs.html';
        }, 1000);
    }
}

function saveJob(jobId) {
    const job = getJobById(jobId);
    if (!job) return;
    
    alert(`✅ Job "${job.title}" has been saved to your favorites!`);
}

function showError(message) {
    const container = document.getElementById('jobDetailsContainer');
    if (container) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--spacing-3xl); grid-column: 1 / -1;">
                <h2>❌ ${message}</h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
                    The job you're looking for doesn't exist or has been removed.
                </p>
                <a href="browse-jobs.html" class="btn btn-primary">Browse All Jobs</a>
            </div>
        `;
    }
}
