// Browse Jobs Logic
document.addEventListener('DOMContentLoaded', function() {
    let allJobs = getAllJobs();
    let filteredJobs = [...allJobs];
    let currentCategory = 'all';
    let currentSort = 'newest';
    
    // Load jobs
    displayJobs(filteredJobs);
    
    // Setup event listeners
    setupCategoryFilters();
    setupSortFilter();
    setupSearch();
    
    function displayJobs(jobs) {
        const jobsList = document.getElementById('jobsList');
        const jobsCount = document.getElementById('jobsCount');
        
        if (!jobsList) return;
        
        jobsCount.textContent = jobs.length;
        
        if (jobs.length === 0) {
            jobsList.innerHTML = `
                <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                    <h3>No jobs found</h3>
                    <p style="color: var(--text-secondary);">Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }
        
        jobsList.innerHTML = jobs.map(job => createJobCard(job)).join('');
        
        // Add click handlers to job cards
        document.querySelectorAll('.job-card-full').forEach(card => {
            card.addEventListener('click', function() {
                const jobId = this.dataset.jobId;
                window.location.href = `job-details.html?id=${jobId}`;
            });
        });
    }
    
    function createJobCard(job) {
        return `
            <div class="job-card-full" data-job-id="${job.id}">
                <div class="job-card-header">
                    <div class="job-card-title">
                        <h3>${job.title}</h3>
                        <div class="job-card-client">
                            👤 ${job.clientName} • ⭐ ${job.clientRating}
                        </div>
                    </div>
                    <div class="job-card-coins">${job.coins} 💰</div>
                </div>
                
                <p class="job-card-description">${job.description}</p>
                
                <div class="job-card-meta">
                    <span class="job-card-tag">${job.categoryIcon} ${job.category}</span>
                    <span class="job-card-tag">⏰ ${job.daysLeft} days left</span>
                    <span class="job-card-tag">📅 Posted ${job.postedDate}</span>
                </div>
                
                <div class="job-card-footer">
                    <div class="job-card-stats">
                        <span>📋 ${job.applications} applications</span>
                    </div>
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); applyToJob(${job.id})">
                        Apply Now
                    </button>
                </div>
            </div>
        `;
    }
    
    function setupCategoryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter jobs
                currentCategory = this.dataset.category;
                applyFilters();
            });
        });
    }
    
    function setupSortFilter() {
        const sortSelect = document.getElementById('sortSelect');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSort = this.value;
                applyFilters();
            });
        }
    }
    
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
    
    function performSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredJobs = [...allJobs];
        } else {
            filteredJobs = allJobs.filter(job => {
                return job.title.toLowerCase().includes(searchTerm) ||
                       job.description.toLowerCase().includes(searchTerm) ||
                       job.category.toLowerCase().includes(searchTerm);
            });
        }
        
        applyFilters();
    }
    
    function applyFilters() {
        let jobs = [...filteredJobs];
        
        // Apply category filter
        if (currentCategory !== 'all') {
            jobs = jobs.filter(job => job.category === currentCategory);
        }
        
        // Apply sort
        jobs = sortJobs(jobs, currentSort);
        
        displayJobs(jobs);
    }
    
    function sortJobs(jobs, sortType) {
        switch(sortType) {
            case 'newest':
                return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            case 'coins_high':
                return jobs.sort((a, b) => b.coins - a.coins);
            case 'coins_low':
                return jobs.sort((a, b) => a.coins - b.coins);
            case 'deadline':
                return jobs.sort((a, b) => a.daysLeft - b.daysLeft);
            default:
                return jobs;
        }
    }
});

// Apply to job function (global)
function applyToJob(jobId) {
    const job = getJobById(jobId);
    if (!job) return;
    
    // Simulate application
    const confirmed = confirm(`Apply to "${job.title}" for ${job.coins} coins?`);
    
    if (confirmed) {
        // In a real app, this would send to backend
        alert('Application submitted successfully! The client will review your application.');
        
        // Update job applications count (simulation)
        job.applications += 1;
        
        // Could redirect to my jobs page
        // window.location.href = 'my-jobs.html';
    }
}
