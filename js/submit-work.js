// Submit Work Logic
document.addEventListener('DOMContentLoaded', function() {
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
        alert('Job not found');
        window.location.href = 'my-jobs.html';
        return;
    }
    
    // Load job summary
    loadJobSummary(jobId);
    
    // Setup file upload
    setupFileUpload();
    
    // Setup form submission
    setupFormSubmission(jobId);
});

function loadJobSummary(jobId) {
    const container = document.getElementById('jobSummary');
    
    // In a real app, we'd fetch the job from backend
    // For now, use dummy data
    const jobs = getMyActiveJobs();
    const job = jobs.find(j => j.id == jobId);
    
    if (!job) {
        container.innerHTML = `
            <h3>Job not found</h3>
            <p>This job may have been removed or completed.</p>
        `;
        return;
    }
    
    container.innerHTML = `
        <h3 style="margin-bottom: var(--spacing-md);">${job.title}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
            <div>
                <div class="info-label">Client</div>
                <div class="info-value">${job.clientName}</div>
            </div>
            <div>
                <div class="info-label">Payment</div>
                <div class="info-value" style="color: var(--accent-color);">${job.coins} 💰</div>
            </div>
            <div>
                <div class="info-label">Deadline</div>
                <div class="info-value">${job.deadline}</div>
            </div>
            <div>
                <div class="info-label">Status</div>
                <div><span class="badge badge-warning">IN PROGRESS</span></div>
            </div>
        </div>
        <div style="padding-top: var(--spacing-md); border-top: 1px solid var(--border-color);">
            <p style="margin: 0; color: var(--text-secondary); font-size: var(--font-size-sm);">
                Complete the form below to submit your work for client review.
            </p>
        </div>
    `;
}

let uploadedFiles = [];

function setupFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = 'transparent';
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    Array.from(files).forEach(file => {
        // Simulate file info
        const fileInfo = {
            name: file.name,
            size: formatFileSize(file.size),
            id: Date.now() + Math.random()
        };
        
        uploadedFiles.push(fileInfo);
        
        // Display file
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = fileInfo.id;
        fileItem.innerHTML = `
            <div class="file-icon">📄</div>
            <div class="file-info">
                <div class="file-name">${fileInfo.name}</div>
                <div class="file-size">${fileInfo.size}</div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile(${fileInfo.id})">×</button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileItem) {
        fileItem.remove();
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function setupFormSubmission(jobId) {
    const form = document.getElementById('submitWorkForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = document.getElementById('workMessage').value;
            const check1 = document.getElementById('check1').checked;
            const check2 = document.getElementById('check2').checked;
            const check3 = document.getElementById('check3').checked;
            
            if (!check1 || !check2 || !check3) {
                alert('Please complete all checklist items before submitting.');
                return;
            }
            
            if (uploadedFiles.length === 0) {
                const confirmNoFiles = confirm('You haven\'t uploaded any files. Continue anyway?');
                if (!confirmNoFiles) return;
            }
            
            // Confirm submission
            const confirmed = confirm(
                'Submit your work for review?\n\n' +
                `Files: ${uploadedFiles.length}\n` +
                'Once submitted, the client will review your work and approve payment if satisfied.'
            );
            
            if (confirmed) {
                submitWork(jobId, message, uploadedFiles);
            }
        });
    }
}

function submitWork(jobId, message, files) {
    // Simulate work submission
    alert(
        '✅ Work submitted successfully!\n\n' +
        'Your work has been sent to the client for review.\n' +
        'You will be notified once the client approves and releases payment.'
    );
    
    // In a real app, this would send data to backend
    console.log('Submitting work:', {
        jobId,
        message,
        files: files.map(f => f.name)
    });
    
    // Redirect to my jobs
    setTimeout(() => {
        window.location.href = 'my-jobs.html';
    }, 1000);
}
