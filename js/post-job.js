// Post Job Logic
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('postJobForm');
    const descInput = document.getElementById('jobDescription');
    const descCount = document.getElementById('descCount');
    
    // Character counter for description
    if (descInput && descCount) {
        descInput.addEventListener('input', function() {
            descCount.textContent = this.value.length;
        });
    }
    
    // Set minimum date to today
    const deadlineInput = document.getElementById('jobDeadline');
    if (deadlineInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Minimum 1 day from now
        deadlineInput.min = today.toISOString().split('T')[0];
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                title: document.getElementById('jobTitle').value,
                category: document.getElementById('jobCategory').value,
                description: document.getElementById('jobDescription').value,
                fullDescription: document.getElementById('jobFullDescription').value,
                deliverables: document.getElementById('jobDeliverables').value.split('\n').filter(d => d.trim()),
                coins: parseInt(document.getElementById('jobCoins').value),
                deadline: document.getElementById('jobDeadline').value
            };
            
            // Validate coins
            const user = getCurrentUser();
            if (formData.coins > user.coins) {
                alert(`❌ Insufficient coins!\n\nYou have ${user.coins} coins, but this job requires ${formData.coins} coins.\n\nPlease reduce the coin amount or add more coins to your wallet.`);
                return;
            }
            
            // Validate deadline
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            if (deadlineDate <= today) {
                alert('❌ Deadline must be in the future!');
                return;
            }
            
            // Confirm job posting
            const confirmed = confirm(
                `Post this job?\n\n` +
                `Title: ${formData.title}\n` +
                `Category: ${formData.category}\n` +
                `Coins: ${formData.coins} 💰\n` +
                `Deadline: ${formData.deadline}\n\n` +
                `${formData.coins} coins will be locked from your wallet.`
            );
            
            if (confirmed) {
                // Simulate posting job
                postJob(formData);
            }
        });
    }
});

async function postJob(jobData) {
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        alert('❌ You must be logged in to post a job.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Get current user data
        const user = getCurrentUser();
        
        // Create job document
        const jobDoc = {
            title: jobData.title,
            category: jobData.category,
            categoryIcon: getCategoryIcon(jobData.category),
            description: jobData.description,
            fullDescription: jobData.fullDescription,
            deliverables: jobData.deliverables,
            coins: jobData.coins,
            deadline: jobData.deadline,
            daysLeft: calculateDaysLeft(jobData.deadline),
            status: 'open',
            clientId: currentUser.uid,
            clientName: user.name,
            clientEmail: user.email,
            applications: 0,
            postedDate: new Date().toISOString().split('T')[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add job to Firestore
        const jobRef = await db.collection('jobs').add(jobDoc);
        
        // Update user's locked coins
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
            coins: firebase.firestore.FieldValue.increment(-jobData.coins),
            lockedCoins: firebase.firestore.FieldValue.increment(jobData.coins),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update localStorage
        user.coins -= jobData.coins;
        user.lockedCoins = (user.lockedCoins || 0) + jobData.coins;
        saveUserData(user);
        
        // Show success message
        alert(
            `✅ Job posted successfully!\n\n` +
            `Your job "${jobData.title}" is now live.\n` +
            `${jobData.coins} coins have been locked.\n\n` +
            `Workers can now browse and apply to your job.`
        );
        
        // Redirect to my jobs
        window.location.href = 'my-jobs.html';
    } catch (error) {
        console.error('Error posting job:', error);
        alert('❌ Failed to post job. Please try again.');
    }
}

function calculateDaysLeft(deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getCategoryIcon(category) {
    const icons = {
        'Web Development': '💻',
        'Design': '🎨',
        'Writing': '✍️',
        'Mobile Apps': '📱',
        'Data Analysis': '📊',
        'Video Editing': '🎬'
    };
    return icons[category] || '💼';
}
