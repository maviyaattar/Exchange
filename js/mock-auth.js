// Mock Authentication System (replaces Firebase Auth)

// Helper function to generate unique IDs
function generateUID() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Mock Authentication State
let mockCurrentUser = null;

// Initialize auth state from localStorage
function initMockAuth() {
    const storedUser = localStorage.getItem('skillexchange_user');
    const isLoggedIn = localStorage.getItem('skillexchange_logged_in');
    
    if (storedUser && isLoggedIn === 'true') {
        mockCurrentUser = JSON.parse(storedUser);
    }
}

// Mock Authentication Functions
const mockAuth = {
    // Get current user
    getCurrentUser: function() {
        return mockCurrentUser;
    },
    
    // Check if logged in
    isLoggedIn: function() {
        return mockCurrentUser !== null && localStorage.getItem('skillexchange_logged_in') === 'true';
    },
    
    // Sign in with email and password
    signInWithEmailAndPassword: async function(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = getUserByEmail(email);
                
                if (!user) {
                    reject({ code: 'auth/user-not-found', message: 'User not found' });
                    return;
                }
                
                if (user.password !== password) {
                    reject({ code: 'auth/wrong-password', message: 'Wrong password' });
                    return;
                }
                
                // Remove password from stored user data
                const userData = { ...user };
                delete userData.password;
                
                mockCurrentUser = userData;
                localStorage.setItem('skillexchange_user', JSON.stringify(userData));
                localStorage.setItem('skillexchange_logged_in', 'true');
                
                resolve({ user: userData });
            }, 500); // Simulate network delay
        });
    },
    
    // Create user with email and password
    createUserWithEmailAndPassword: async function(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if user already exists
                const existingUser = getUserByEmail(email);
                
                if (existingUser) {
                    reject({ code: 'auth/email-already-in-use', message: 'Email already in use' });
                    return;
                }
                
                // Validate password
                if (password.length < 6) {
                    reject({ code: 'auth/weak-password', message: 'Password should be at least 6 characters' });
                    return;
                }
                
                // Create new user
                const newUser = {
                    uid: generateUID(),
                    email: email,
                    name: email.split('@')[0], // Default name from email
                    role: 'worker',
                    avatar: '👤',
                    coins: 100, // Starting coins
                    lockedCoins: 0,
                    earnedCoins: 0,
                    rating: 0,
                    skills: [],
                    completedJobs: 0,
                    activeJobs: 0,
                    photoURL: null,
                    createdAt: new Date().toISOString()
                };
                
                // Add to mock database
                if (window.MOCK_DATA && window.MOCK_DATA.users) {
                    window.MOCK_DATA.users.push({ ...newUser, password });
                }
                
                // Don't store password in user session
                const userData = { ...newUser };
                
                mockCurrentUser = userData;
                localStorage.setItem('skillexchange_user', JSON.stringify(userData));
                localStorage.setItem('skillexchange_logged_in', 'true');
                
                resolve({ 
                    user: userData,
                    additionalUserInfo: { isNewUser: true }
                });
            }, 500);
        });
    },
    
    // Sign in anonymously (guest mode)
    signInAnonymously: async function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const guestUser = {
                    uid: generateUID(),
                    email: 'guest@skillexchange.local',
                    name: 'Guest User',
                    role: 'worker',
                    avatar: '👤',
                    coins: 500, // Give guests more starting coins
                    lockedCoins: 0,
                    earnedCoins: 0,
                    rating: 0,
                    skills: [],
                    completedJobs: 0,
                    activeJobs: 0,
                    photoURL: null,
                    isGuest: true,
                    createdAt: new Date().toISOString()
                };
                
                mockCurrentUser = guestUser;
                localStorage.setItem('skillexchange_user', JSON.stringify(guestUser));
                localStorage.setItem('skillexchange_logged_in', 'true');
                
                resolve({ user: guestUser });
            }, 500);
        });
    },
    
    // Sign out
    signOut: async function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockCurrentUser = null;
                localStorage.removeItem('skillexchange_user');
                localStorage.removeItem('skillexchange_logged_in');
                resolve();
            }, 300);
        });
    },
    
    // Update user profile
    updateProfile: async function(updates) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (mockCurrentUser) {
                    mockCurrentUser = { ...mockCurrentUser, ...updates };
                    localStorage.setItem('skillexchange_user', JSON.stringify(mockCurrentUser));
                }
                resolve();
            }, 300);
        });
    },
    
    // Auth state observer (mock)
    onAuthStateChanged: function(callback) {
        // Call immediately with current state
        callback(mockCurrentUser);
        
        // Return unsubscribe function
        return function() {
            // Mock unsubscribe
        };
    }
};

// Mock Firestore functions
const mockFirestore = {
    collection: function(collectionName) {
        return {
            doc: function(docId) {
                return {
                    get: async function() {
                        // Return mock data based on collection
                        if (collectionName === 'users') {
                            const user = getUserById(docId);
                            return {
                                exists: !!user,
                                data: () => user
                            };
                        }
                        return { exists: false, data: () => null };
                    },
                    set: async function(data) {
                        // Mock set operation
                        return Promise.resolve();
                    },
                    update: async function(data) {
                        // Mock update operation
                        if (collectionName === 'users' && docId === mockCurrentUser?.uid) {
                            mockCurrentUser = { ...mockCurrentUser, ...data };
                            localStorage.setItem('skillexchange_user', JSON.stringify(mockCurrentUser));
                        }
                        return Promise.resolve();
                    }
                };
            }
        };
    }
};

// Initialize on load
initMockAuth();

// Export mock functions
if (typeof window !== 'undefined') {
    window.mockAuth = mockAuth;
    window.mockFirestore = mockFirestore;
    window.initMockAuth = initMockAuth;
    
    // Also provide as getAuth and getFirestore for compatibility
    window.getAuth = () => mockAuth;
    window.getFirestore = () => mockFirestore;
    window.getCurrentFirebaseUser = () => mockCurrentUser;
    window.isUserLoggedIn = () => mockAuth.isLoggedIn();
}
