# Skill Exchange - Skills Marketplace Platform

A complete web application for a skills-based marketplace platform. Built with HTML, CSS, vanilla JavaScript, and mock data backend (formerly Firebase-based).

## 🎯 Overview

Skill Exchange is a marketplace where:
- **Clients** post jobs and offer coins as payment
- **Workers** browse jobs, apply, and earn coins for completed work
- **Coins** serve as virtual internal credits for all transactions
- **Mock Data** provides all backend functionality without external dependencies

## ✨ Features

### Core Functionality
- 🏠 **Landing Page** - Hero section, categories, featured jobs
- 🔐 **Authentication** - Login/Register with mock authentication system
- 📊 **Dashboard** - Overview of stats, recent activity, and quick actions
- 💼 **Browse Jobs** - Search, filter by category, sort jobs
- 📋 **Job Details** - Complete job information with apply functionality
- ➕ **Post Job** - Form for clients to create new job listings
- 📂 **My Jobs** - Manage active, in-progress, and completed jobs
- 📤 **Submit Work** - Upload deliverables and submit for review
- 💰 **Wallet** - View balance, locked coins, and transaction history
- 👤 **Profile** - User information, skills, ratings, and recent work
- 🔔 **Notifications** - Activity feed with notifications
- 💬 **Messages** - Chat system for client-worker communication
- ⚙️ **Settings** - Account, appearance, and privacy settings
- 📄 **Legal Pages** - Privacy Policy and Terms & Conditions

### Design Features
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Mobile-first approach
- ✅ Sidebar navigation for desktop
- ✅ Bottom navigation bar for mobile
- ✅ Professional icons with Font Awesome
- ✅ Clean, modern UI with smooth animations
- ✅ Intuitive user experience
- ✅ Skeleton loaders and loading animations

### Data Management
- ✅ Mock authentication system (no external dependencies)
- ✅ LocalStorage for user session management
- ✅ Comprehensive mock data for all features
- ✅ Simulated async operations for realistic UX
- ✅ Data persistence across sessions

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Python 3 (for local development server) or any other HTTP server

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

## 🔐 Demo Accounts

You can use these demo accounts to test the application:

- Email: `john@example.com` / Password: `password123`
- Email: `demo@example.com` / Password: `demo123`

Or create a new account, or continue as a guest!

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **LocalStorage** - Client-side data persistence
- **Font Awesome** - Professional icon library

## 📱 Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

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
│   ├── chat.html
│   ├── profile.html
│   ├── notifications.html
│   ├── settings.html
│   ├── privacy-policy.html
│   ├── terms-and-conditions.html
│   └── ...
├── css/                    # Stylesheets
│   ├── global.css
│   ├── landing.css
│   ├── dashboard.css
│   ├── auth.css
│   └── ...
├── js/                     # JavaScript files
│   ├── mock-auth.js        # Mock authentication system
│   ├── data.js             # Mock data and helpers
│   ├── auth.js             # Authentication logic
│   ├── dashboard.js
│   ├── browse-jobs.js
│   ├── post-job.js
│   └── ...
└── .gitignore
```

## 🔄 Recent Changes

- ✅ Removed all Firebase dependencies
- ✅ Implemented mock authentication system
- ✅ Added comprehensive mock data backend
- ✅ Renamed from "WorkCoin" to "Skill Exchange"
- ✅ Added Privacy Policy page
- ✅ Added Terms and Conditions page
- ✅ Improved responsive design
- ✅ Added loading animations and skeleton loaders

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with modern web technologies for a fully functional standalone marketplace platform.**

