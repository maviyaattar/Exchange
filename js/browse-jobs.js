// Browse Jobs Logic
document.addEventListener('DOMContentLoaded', async function() {
    let allJobs = [];
    let filteredJobs = [];
    let currentCategory = 'all';
    let currentSort = 'newest';
    
    // Load jobs from Firestore
    await loadJobsFromFirestore();
    
    // Setup event listeners
    setupCategoryFilters();
    setupSortFilter();
    setupSearch();
    
    async function loadJobsFromFirestore() {
        const db = getFirestore();
        const jobsList = document.getElementById('jobsList');
        
        if (jobsList) {
            jobsList.innerHTML = '<div class="loading">Loading jobs...</div>';
        }
        
        try {
            const snapshot = await db.collection('jobs')
                .where('status', '==', 'open')
                .orderBy('createdAt', 'desc')
                .get();
            
            allJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // If no jobs in Firestore, fallback to dummy data
            if (allJobs.length === 0) {
                allJobs = getAllJobs();
            }
            
            filteredJobs = [...allJobs];
            displayJobs(filteredJobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
            // Fallback to dummy data on error
            allJobs = getAllJobs();
            filteredJobs = [...allJobs];
            displayJobs(filteredJobs);
        }
    }
    
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
                            <i class="fas fa-user"></i> ${job.clientName} • <i class="fas fa-star"></i> ${job.clientRating}
                        </div>
                    </div>
                    <div class="job-card-coins">${job.coins} <i class="fas fa-coins"></i></div>
                </div>
                
                <p class="job-card-description">${job.description}</p>
                
                <div class="job-card-meta">
                    <span class="job-card-tag">${job.categoryIcon} ${job.category}</span>
                    <span class="job-card-tag"><i class="far fa-clock"></i> ${job.daysLeft} days left</span>
                    <span class="job-card-tag"><i class="far fa-calendar"></i> Posted ${job.postedDate}</span>
                </div>
                
                <div class="job-card-footer">
                    <div class="job-card-stats">
                        <span><i class="fas fa-file-alt"></i> ${job.applications} applications</span>
                    </div>
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); applyToJob('${job.id}')">
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
async function applyToJob(jobId) {
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        alert('❌ Please login to apply for jobs.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Get job details
        const jobDoc = await db.collection('jobs').doc(jobId).get();
        if (!jobDoc.exists) {
            alert('❌ Job not found.');
            return;
        }
        
        const job = jobDoc.data();
        
        // Check if user already applied
        const existingApplication = await db.collection('applications')
            .where('jobId', '==', jobId)
            .where('workerId', '==', currentUser.uid)
            .get();
        
        if (!existingApplication.empty) {
            alert('You have already applied to this job.');
            return;
        }
        
        // Confirm application
        const confirmed = confirm(`Apply to "${job.title}" for ${job.coins} coins?`);
        
        if (confirmed) {
            // Create application document
            const user = getCurrentUser();
            await db.collection('applications').add({
                jobId: jobId,
                workerId: currentUser.uid,
                workerName: user.name,
                workerEmail: user.email,
                workerRating: user.rating || 0,
                status: 'pending',
                appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
                message: 'I am interested in this job and have the required skills.'
            });
            
            // Increment applications count
            await db.collection('jobs').doc(jobId).update({
                applications: firebase.firestore.FieldValue.increment(1)
            });
            
            alert('✅ Application submitted successfully! The client will review your application.');
            
            // Reload jobs to update count
            location.reload();
        }
    } catch (error) {
        console.error('Error applying to job:', error);
        alert('❌ Failed to apply. Please try again.');
    }
}
