# WorkCoin - Coin-Based Work Marketplace

A complete web application for a coin-based work marketplace platform (similar to Fiverr/Upwork). Built with HTML, CSS, vanilla JavaScript, and Firebase backend.

## 🎯 Overview

WorkCoin is a work marketplace where:
- **Clients** post jobs and offer coins as payment
- **Workers** browse jobs, apply, and earn coins for completed work
- **Coins** serve as virtual internal credits for all transactions
- **Firebase** provides authentication, real-time database, and cloud messaging

## ✨ Features

### Core Functionality
- 🏠 **Landing Page** - Hero section, categories, featured jobs
- 🔐 **Authentication** - Login/Register with Firebase Authentication
- 📊 **Dashboard** - Overview of stats, recent activity, and quick actions
- 💼 **Browse Jobs** - Search, filter by category, sort jobs (loaded from Firestore)
- 📋 **Job Details** - Complete job information with apply functionality
- ➕ **Post Job** - Form for clients to create new job listings (saved to Firestore)
- 📂 **My Jobs** - Manage active, in-progress, and completed jobs
- 📤 **Submit Work** - Upload deliverables and submit for review
- 💰 **Wallet** - View balance, locked coins, and transaction history (Firestore)
- 👤 **Profile** - User information, skills, ratings, and recent work
- 🔔 **Notifications** - Activity feed with Firebase Cloud Messaging
- ⚙️ **Settings** - Account, appearance, and privacy settings

### Design Features
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Mobile-first approach
- ✅ Sidebar navigation for desktop
- ✅ Bottom navigation bar for mobile
- ✅ Professional icons with Font Awesome
- ✅ Clean, modern UI with smooth animations
- ✅ Intuitive user experience

### Firebase Integration
- ✅ Firebase Authentication (Email/Password, Anonymous)
- ✅ Cloud Firestore for real-time data storage
- ✅ Firebase Storage for file uploads
- ✅ Firebase Cloud Messaging for push notifications
- ✅ Automatic user profile creation
- ✅ Real-time job updates
- ✅ Transaction tracking

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Python 3 (for local development server)
- Firebase account (for backend services)

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following services:
   - **Authentication**: Enable Email/Password and Anonymous providers
   - **Cloud Firestore**: Create database in production mode
   - **Cloud Messaging**: Enable FCM and get your VAPID key
   - **Storage**: Enable Firebase Storage

3. Update Firebase configuration in `js/firebase-init.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

4. Update the VAPID key in `js/notifications.js`:
```javascript
vapidKey: 'YOUR_VAPID_KEY_HERE'
```

5. Set up Firestore security rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.clientId;
    }
    
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.workerId;
    }
    
    match /transactions/{transactionId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/maviyaattar/Exchange.git
cd Exchange
```

2. Start a local server:
```bash
python3 -m http.server 8080
```

3. Open your browser: `http://localhost:8080`

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **Vanilla JavaScript** - No frameworks
- **Firebase** - Backend services
  - Authentication
  - Cloud Firestore
  - Cloud Storage
  - Cloud Messaging
- **Font Awesome** - Professional icon library

## 📱 Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules to protect user data
- Input validation and sanitization
- Secure transaction handling

## 📦 Project Structure

```
Exchange/
├── index.html              # Landing page
├── pages/                  # Application pages
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── browse-jobs.html
│   ├── post-job.html
│   ├── my-jobs.html
│   ├── wallet.html
│   ├── profile.html
│   ├── notifications.html
│   └── ...
├── css/                    # Stylesheets
│   ├── global.css
│   ├── landing.css
│   ├── dashboard.css
│   └── ...
├── js/                     # JavaScript files
│   ├── firebase-init.js    # Firebase initialization
│   ├── auth.js             # Authentication logic
│   ├── data.js             # Data helpers
│   ├── dashboard.js
│   ├── browse-jobs.js
│   ├── post-job.js
│   └── ...
└── firebase-messaging-sw.js # Service worker for FCM
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with Firebase and modern web technologies for a scalable marketplace platform.**

