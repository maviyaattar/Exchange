// Dummy Data for the Application

const DUMMY_DATA = {
    // Current User (will be overridden by localStorage)
    currentUser: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'worker',
        avatar: '👤',
        coins: 1250,
        lockedCoins: 500,
        earnedCoins: 2000,
        rating: 4.5,
        skills: ['Web Development', 'JavaScript', 'React', 'CSS'],
        completedJobs: 15,
        activeJobs: 3
    },
    
    // Jobs Database
    jobs: [
        {
            id: 1,
            title: 'Build Responsive Landing Page',
            description: 'Looking for an experienced frontend developer to create a modern, responsive landing page for our startup. Must be proficient in HTML, CSS, and JavaScript. The page should be mobile-friendly and follow modern design principles.',
            fullDescription: 'We need a talented frontend developer to build a stunning landing page for our SaaS product. The page should include: hero section, features section, pricing table, testimonials, and contact form. Must be responsive and work perfectly on all devices.',
            deliverables: ['Fully responsive HTML/CSS/JS code', 'Mobile-optimized design', 'Cross-browser compatibility', 'Source files'],
            coins: 500,
            category: 'Web Development',
            categoryIcon: '💻',
            deadline: '2024-02-15',
            daysLeft: 5,
            status: 'open',
            clientId: 2,
            clientName: 'Sarah Johnson',
            clientRating: 4.8,
            applications: 8,
            postedDate: '2024-02-10'
        },
        {
            id: 2,
            title: 'Logo Design for Tech Company',
            description: 'Need a creative designer to design a modern logo for our technology startup. Multiple concepts required. The logo should be minimalist, professional, and work well in both color and monochrome.',
            fullDescription: 'We are a B2B SaaS company looking for a talented designer to create our brand identity. We need 3 initial concepts, with 2 rounds of revisions. Final deliverables should include vector files in multiple formats.',
            deliverables: ['3 initial logo concepts', '2 rounds of revisions', 'Vector files (AI, SVG, EPS)', 'PNG files in various sizes', 'Brand guidelines document'],
            coins: 350,
            category: 'Design',
            categoryIcon: '🎨',
            deadline: '2024-02-20',
            daysLeft: 7,
            status: 'open',
            clientId: 3,
            clientName: 'Mike Chen',
            clientRating: 4.6,
            applications: 12,
            postedDate: '2024-02-08'
        },
        {
            id: 3,
            title: 'Write SEO Blog Articles',
            description: 'Looking for experienced content writer to create 5 SEO-optimized blog articles about digital marketing. Each article should be 1000-1500 words, well-researched, and engaging.',
            fullDescription: 'We need high-quality blog content for our digital marketing agency. Topics will be provided. Writer must have experience with SEO best practices, keyword integration, and creating engaging content that ranks well.',
            deliverables: ['5 blog articles (1000-1500 words each)', 'SEO-optimized content', 'Keyword research included', 'Meta descriptions', 'Royalty-free images'],
            coins: 200,
            category: 'Writing',
            categoryIcon: '✍️',
            deadline: '2024-02-25',
            daysLeft: 10,
            status: 'open',
            clientId: 4,
            clientName: 'Emily Brown',
            clientRating: 4.9,
            applications: 15,
            postedDate: '2024-02-05'
        },
        {
            id: 4,
            title: 'Mobile App UI/UX Design',
            description: 'Design user interface and user experience for a fitness tracking mobile app. Must include wireframes, high-fidelity mockups, and prototype.',
            fullDescription: 'We are developing a fitness tracking mobile app and need a talented UI/UX designer. The app should have a clean, modern design with excellent usability. Deliverables include user flows, wireframes, and high-fidelity designs for iOS and Android.',
            deliverables: ['User flow diagrams', 'Wireframes for all screens', 'High-fidelity mockups', 'Interactive prototype', 'Design system documentation'],
            coins: 800,
            category: 'Mobile Apps',
            categoryIcon: '📱',
            deadline: '2024-03-01',
            daysLeft: 15,
            status: 'open',
            clientId: 2,
            clientName: 'Sarah Johnson',
            clientRating: 4.8,
            applications: 6,
            postedDate: '2024-02-12'
        },
        {
            id: 5,
            title: 'Data Analysis & Visualization',
            description: 'Analyze sales data and create interactive dashboards. Must be proficient in Python, Pandas, and data visualization libraries.',
            fullDescription: 'We have 2 years of sales data that needs comprehensive analysis. Looking for a data analyst to identify trends, patterns, and insights. Create interactive dashboards using tools like Tableau or Power BI.',
            deliverables: ['Data cleaning and preprocessing', 'Statistical analysis report', 'Interactive dashboards', 'Insights and recommendations', 'Python scripts'],
            coins: 600,
            category: 'Data Analysis',
            categoryIcon: '📊',
            deadline: '2024-02-28',
            daysLeft: 12,
            status: 'open',
            clientId: 5,
            clientName: 'David Wilson',
            clientRating: 4.7,
            applications: 9,
            postedDate: '2024-02-09'
        },
        {
            id: 6,
            title: 'Edit Product Demo Video',
            description: 'Edit a 3-minute product demonstration video with professional transitions, text overlays, and background music.',
            fullDescription: 'We have raw footage of our product demo and need a video editor to create a polished, professional video. Should include smooth transitions, text animations, background music, and color grading.',
            deliverables: ['3-minute edited video', 'Professional color grading', 'Text overlays and animations', 'Background music integration', 'Multiple format exports'],
            coins: 450,
            category: 'Video Editing',
            categoryIcon: '🎬',
            deadline: '2024-02-22',
            daysLeft: 8,
            status: 'open',
            clientId: 3,
            clientName: 'Mike Chen',
            clientRating: 4.6,
            applications: 10,
            postedDate: '2024-02-11'
        }
    ],
    
    // User's Active Jobs (as worker)
    myActiveJobs: [
        {
            id: 101,
            title: 'E-commerce Website Development',
            coins: 1500,
            status: 'in_progress',
            clientName: 'Alice Smith',
            deadline: '2024-02-28',
            progress: 60,
            assignedDate: '2024-02-01'
        },
        {
            id: 102,
            title: 'Social Media Graphics Pack',
            coins: 300,
            status: 'in_progress',
            clientName: 'Bob Anderson',
            deadline: '2024-02-18',
            progress: 80,
            assignedDate: '2024-02-08'
        }
    ],
    
    // User's Posted Jobs (as client)
    myPostedJobs: [
        {
            id: 201,
            title: 'WordPress Theme Customization',
            coins: 400,
            status: 'open',
            applicants: 7,
            deadline: '2024-02-25',
            postedDate: '2024-02-10'
        }
    ],
    
    // Transactions History
    transactions: [
        {
            id: 1,
            date: '2024-02-12',
            description: 'Payment received for "Website Redesign"',
            amount: 750,
            type: 'credit'
        },
        {
            id: 2,
            date: '2024-02-10',
            description: 'Coins locked for "Logo Design"',
            amount: -300,
            type: 'debit'
        },
        {
            id: 3,
            date: '2024-02-08',
            description: 'Payment received for "Content Writing"',
            amount: 200,
            type: 'credit'
        },
        {
            id: 4,
            date: '2024-02-05',
            description: 'Withdrawal to bank account',
            amount: -500,
            type: 'debit'
        },
        {
            id: 5,
            date: '2024-02-03',
            description: 'Bonus coins for profile completion',
            amount: 100,
            type: 'credit'
        }
    ],
    
    // Notifications
    notifications: [
        {
            id: 1,
            message: 'New application on your job "WordPress Theme Customization"',
            time: '2 hours ago',
            read: false,
            jobId: 201,
            type: 'application'
        },
        {
            id: 2,
            message: 'Payment of 750 coins has been released to your wallet',
            time: '5 hours ago',
            read: false,
            type: 'payment'
        },
        {
            id: 3,
            message: 'Your submission for "Social Media Graphics Pack" was approved',
            time: '1 day ago',
            read: true,
            jobId: 102,
            type: 'approval'
        },
        {
            id: 4,
            message: 'Reminder: "E-commerce Website Development" deadline is in 3 days',
            time: '2 days ago',
            read: true,
            jobId: 101,
            type: 'reminder'
        }
    ],
    
    // Categories
    categories: [
        { name: 'Web Development', icon: '💻', count: 1234 },
        { name: 'Design', icon: '🎨', count: 856 },
        { name: 'Writing', icon: '✍️', count: 643 },
        { name: 'Mobile Apps', icon: '📱', count: 512 },
        { name: 'Data Analysis', icon: '📊', count: 389 },
        { name: 'Video Editing', icon: '🎬', count: 275 }
    ]
};

// Helper Functions
function getCurrentUser() {
    const storedUser = localStorage.getItem('workcoin_user');
    return storedUser ? JSON.parse(storedUser) : DUMMY_DATA.currentUser;
}

function updateUserCoins(amount) {
    const user = getCurrentUser();
    user.coins += amount;
    localStorage.setItem('workcoin_user', JSON.stringify(user));
}

function getAllJobs() {
    return DUMMY_DATA.jobs;
}

function getJobById(id) {
    return DUMMY_DATA.jobs.find(job => job.id === parseInt(id));
}

function getMyActiveJobs() {
    return DUMMY_DATA.myActiveJobs;
}

function getMyPostedJobs() {
    return DUMMY_DATA.myPostedJobs;
}

function getTransactions() {
    return DUMMY_DATA.transactions;
}

function getNotifications() {
    return DUMMY_DATA.notifications;
}

function getUnreadNotificationsCount() {
    return DUMMY_DATA.notifications.filter(n => !n.read).length;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DUMMY_DATA;
}
