// Chat functionality with Firebase Realtime Database
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('workcoin_user') || '{}');
    if (!user.email) {
        window.location.href = '../pages/login.html';
        return;
    }

    // Update header
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('headerCoins').textContent = user.coins || 0;
    document.getElementById('userAvatar').textContent = user.avatar || '👤';

    // Elements
    const conversationsList = document.getElementById('conversationsList');
    const chatMessages = document.getElementById('chatMessages');
    const chatInputContainer = document.getElementById('chatInputContainer');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const filePreview = document.getElementById('filePreview');
    const chatUserName = document.getElementById('chatUserName');
    const chatJobTitle = document.getElementById('chatJobTitle');
    const viewJobBtn = document.getElementById('viewJobBtn');
    const approveWorkBtn = document.getElementById('approveWorkBtn');
    const negotiateBtn = document.getElementById('negotiateBtn');

    let currentConversation = null;
    let selectedFiles = [];
    let messagesListener = null;

    // Sample conversations data (will be replaced with Firebase)
    const sampleConversations = [
        {
            id: 'conv1',
            otherUser: {
                name: 'Sarah Johnson',
                avatar: '👩',
                email: 'sarah@example.com'
            },
            job: {
                id: 'job1',
                title: 'Build Responsive Landing Page',
                coins: 500
            },
            lastMessage: {
                text: 'I\'ve uploaded the final design files',
                time: new Date().getTime() - 300000,
                sender: 'sarah@example.com'
            },
            unread: 2
        },
        {
            id: 'conv2',
            otherUser: {
                name: 'Mike Chen',
                avatar: '👨',
                email: 'mike@example.com'
            },
            job: {
                id: 'job2',
                title: 'Logo Design for Tech Company',
                coins: 350
            },
            lastMessage: {
                text: 'When do you need this completed?',
                time: new Date().getTime() - 3600000,
                sender: 'mike@example.com'
            },
            unread: 0
        },
        {
            id: 'conv3',
            otherUser: {
                name: 'Emily Brown',
                avatar: '👩',
                email: 'emily@example.com'
            },
            job: {
                id: 'job3',
                title: 'Write SEO Blog Articles',
                coins: 200
            },
            lastMessage: {
                text: 'Perfect! Looking forward to working with you',
                time: new Date().getTime() - 7200000,
                sender: user.email
            },
            unread: 0
        }
    ];

    // Sample messages for each conversation
    const sampleMessages = {
        'conv1': [
            {
                id: 'msg1',
                text: 'Hi! I saw your job posting for the landing page. I have 5 years of experience in frontend development.',
                sender: user.email,
                timestamp: new Date().getTime() - 86400000,
                files: []
            },
            {
                id: 'msg2',
                text: 'Great! Can you share some of your previous work?',
                sender: 'sarah@example.com',
                timestamp: new Date().getTime() - 86000000,
                files: []
            },
            {
                id: 'msg3',
                text: 'Sure! Here are some portfolio links and examples.',
                sender: user.email,
                timestamp: new Date().getTime() - 85000000,
                files: [
                    { name: 'portfolio.pdf', size: '2.4 MB', url: '#' }
                ]
            },
            {
                id: 'msg4',
                text: 'Looks impressive! I\'d like to hire you for this project. Here are the detailed requirements.',
                sender: 'sarah@example.com',
                timestamp: new Date().getTime() - 84000000,
                files: [
                    { name: 'requirements.docx', size: '156 KB', url: '#' }
                ]
            },
            {
                id: 'msg5',
                text: 'I\'ve uploaded the final design files. Please review and let me know if you need any changes.',
                sender: 'sarah@example.com',
                timestamp: new Date().getTime() - 300000,
                files: [
                    { name: 'landing-page-final.zip', size: '5.2 MB', url: '#' }
                ]
            }
        ],
        'conv2': [
            {
                id: 'msg6',
                text: 'Hello! I\'m interested in your logo design project.',
                sender: user.email,
                timestamp: new Date().getTime() - 7200000,
                files: []
            },
            {
                id: 'msg7',
                text: 'Hi! That\'s great. When do you need this completed?',
                sender: 'mike@example.com',
                timestamp: new Date().getTime() - 3600000,
                files: []
            }
        ],
        'conv3': [
            {
                id: 'msg8',
                text: 'I\'d love to work on the SEO blog articles for you!',
                sender: user.email,
                timestamp: new Date().getTime() - 14400000,
                files: []
            },
            {
                id: 'msg9',
                text: 'Perfect! Looking forward to working with you',
                sender: user.email,
                timestamp: new Date().getTime() - 7200000,
                files: []
            }
        ]
    };

    // Load conversations
    function loadConversations() {
        conversationsList.innerHTML = '';
        
        sampleConversations.forEach(conv => {
            const convElement = createConversationElement(conv);
            conversationsList.appendChild(convElement);
        });
    }

    // Create conversation element
    function createConversationElement(conv) {
        const div = document.createElement('div');
        div.className = 'conversation-item';
        if (conv.unread > 0) {
            div.classList.add('unread');
        }
        div.dataset.convId = conv.id;

        const timeAgo = getTimeAgo(conv.lastMessage.time);
        const isOwnMessage = conv.lastMessage.sender === user.email;

        div.innerHTML = `
            <div class="conversation-avatar">${conv.otherUser.avatar}</div>
            <div class="conversation-details">
                <div class="conversation-header">
                    <span class="conversation-name">${conv.otherUser.name}</span>
                    <span class="conversation-time">${timeAgo}</span>
                </div>
                <div class="conversation-job">${conv.job.title}</div>
                <div class="conversation-preview">
                    ${isOwnMessage ? 'You: ' : ''}${conv.lastMessage.text}
                </div>
            </div>
            ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
        `;

        div.addEventListener('click', () => openConversation(conv));

        return div;
    }

    // Open conversation
    function openConversation(conv) {
        currentConversation = conv;
        
        // Update active state
        document.querySelectorAll('.conversation-item').forEach(el => {
            el.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // Update chat header
        chatUserName.textContent = conv.otherUser.name;
        chatJobTitle.textContent = conv.job.title;
        
        // Show action buttons
        viewJobBtn.style.display = 'inline-flex';
        approveWorkBtn.style.display = 'inline-flex';
        negotiateBtn.style.display = 'inline-flex';

        // Show input
        chatInputContainer.style.display = 'block';

        // Load messages
        loadMessages(conv.id);

        // Mark as read
        conv.unread = 0;
        loadConversations();
    }

    // Load messages
    function loadMessages(convId) {
        const messages = sampleMessages[convId] || [];
        chatMessages.innerHTML = '';

        let lastDate = null;

        messages.forEach(msg => {
            const msgDate = new Date(msg.timestamp).toDateString();
            if (msgDate !== lastDate) {
                const dateSep = createDateSeparator(msg.timestamp);
                chatMessages.appendChild(dateSep);
                lastDate = msgDate;
            }

            const msgElement = createMessageElement(msg);
            chatMessages.appendChild(msgElement);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Create date separator
    function createDateSeparator(timestamp) {
        const div = document.createElement('div');
        div.className = 'date-separator';
        
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateText = date.toLocaleDateString();
        if (date.toDateString() === today.toDateString()) {
            dateText = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateText = 'Yesterday';
        }

        div.innerHTML = `<span>${dateText}</span>`;
        return div;
    }

    // Create message element
    function createMessageElement(msg) {
        const div = document.createElement('div');
        div.className = 'message';
        if (msg.sender === user.email) {
            div.classList.add('sent');
        }

        const avatar = msg.sender === user.email ? user.avatar : currentConversation.otherUser.avatar;
        const time = new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        let filesHtml = '';
        if (msg.files && msg.files.length > 0) {
            filesHtml = msg.files.map(file => `
                <div class="message-file">
                    <span class="file-icon">📎</span>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${file.size}</div>
                    </div>
                </div>
            `).join('');
        }

        div.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${msg.text}</div>
                ${filesHtml}
                <div class="message-info">
                    <span>${time}</span>
                </div>
            </div>
        `;

        return div;
    }

    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text && selectedFiles.length === 0) return;
        if (!currentConversation) return;

        const message = {
            id: 'msg' + Date.now(),
            text: text,
            sender: user.email,
            timestamp: Date.now(),
            files: selectedFiles.map(file => ({
                name: file.name,
                size: formatFileSize(file.size),
                url: '#'
            }))
        };

        // Add to messages
        if (!sampleMessages[currentConversation.id]) {
            sampleMessages[currentConversation.id] = [];
        }
        sampleMessages[currentConversation.id].push(message);

        // Update conversation
        currentConversation.lastMessage = {
            text: text || '📎 File attachment',
            time: Date.now(),
            sender: user.email
        };

        // Clear input
        messageInput.value = '';
        selectedFiles = [];
        filePreview.innerHTML = '';

        // Reload
        loadMessages(currentConversation.id);
        loadConversations();

        // In real app, this would use Firebase:
        // const messagesRef = rtdb.ref(`conversations/${currentConversation.id}/messages`);
        // messagesRef.push(message);
    }

    // File upload
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        selectedFiles = [...selectedFiles, ...files];
        updateFilePreview();
    });

    function updateFilePreview() {
        filePreview.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-preview-item';
            div.innerHTML = `
                <span>📎 ${file.name}</span>
                <span class="file-preview-remove" data-index="${index}">×</span>
            `;
            filePreview.appendChild(div);
        });

        // Add remove handlers
        document.querySelectorAll('.file-preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                selectedFiles.splice(index, 1);
                updateFilePreview();
            });
        });
    }

    // Send button
    sendMessageBtn.addEventListener('click', sendMessage);

    // Enter to send
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // View job button
    viewJobBtn.addEventListener('click', () => {
        if (currentConversation) {
            window.location.href = `job-details.html?id=${currentConversation.job.id}`;
        }
    });

    // Approve work button
    approveWorkBtn.addEventListener('click', () => {
        if (!currentConversation) return;

        if (confirm(`Approve work and release ${currentConversation.job.coins} coins?`)) {
            alert('✅ Work approved! Coins have been released to the worker.');
            
            // In real app, this would update Firebase and user coins
            const message = {
                id: 'msg' + Date.now(),
                text: '✅ Work has been approved! Payment released.',
                sender: 'system',
                timestamp: Date.now(),
                files: []
            };
            
            sampleMessages[currentConversation.id].push(message);
            loadMessages(currentConversation.id);
        }
    });

    // Negotiate button
    negotiateBtn.addEventListener('click', () => {
        if (!currentConversation) return;

        const newPrice = prompt(`Current price: ${currentConversation.job.coins} coins. Enter your counter-offer:`);
        
        if (newPrice && !isNaN(newPrice)) {
            const message = {
                id: 'msg' + Date.now(),
                text: `💰 Counter-offer: ${newPrice} coins for "${currentConversation.job.title}"`,
                sender: user.email,
                timestamp: Date.now(),
                files: [],
                isNegotiation: true
            };
            
            sampleMessages[currentConversation.id].push(message);
            loadMessages(currentConversation.id);
            
            // Auto-scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // Helper functions
    function getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        return new Date(timestamp).toLocaleDateString();
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // Initialize
    loadConversations();
});
