# 🚀 TeamTask - Production-Level MERN Task Management System

TeamTask is a high-performance, real-time team collaboration and task management platform built with the MERN stack. It features a premium, responsive design with glassmorphism aesthetics, real-time synchronization, and advanced user customization.

![Banner](https://img.shields.io/badge/Status-Production--Ready-brightgreen)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![Socket.io](https://img.shields.io/badge/Sync-Real--Time-orange)

## ✨ Key Features

### 🏢 Workspace Management
- **Project CRUD**: Admins can create, edit, and delete projects.
- **Kanban Board**: Drag-and-drop-style task status management (To Do, In Progress, Done).
- **Team Management**: Invite members and manage roles (Admin/Member).

### ⚡ Real-Time Capabilities
- **Socket.IO Integration**: Instant notifications for task assignments and project updates.
- **Interactive Toasts**: Hyper-interactive notification system with clickable shortcuts and drag-to-dismiss.

### 🎨 Personalization & UX
- **Dynamic Themes**: Full support for Dark/Light mode with persistence.
- **Accent Colors**: Instant app-wide primary color switching via the Settings page.
- **Global Search**: Real-time filtering for projects and tasks.
- **Password Security**: Built-in visibility toggle (eye icon) for all secure fields.

### 🔒 Security & Auth
- **JWT Authentication**: Secure token-based auth with protected routes.
- **RBAC**: Role-Based Access Control ensuring only Admins can perform destructive actions.

## 🛠️ Technical Stack

### Frontend
- **Framework**: Vite + React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide-React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO
- **Auth**: JWT + Bcrypt

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jitenkoundinye2004/Task-management.git
   cd Task-management
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📸 Project Structure

```
├── client/              # Vite + React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Theme, Socket, and Toast context
│   │   ├── pages/       # Dashboard, Projects, Tasks, etc.
│   │   └── redux/       # Global state management
├── server/              # Node + Express Backend
│   ├── controllers/     # API logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # Express endpoints
│   └── middleware/      # Auth and error handlers
└── README.md
```

## 📄 License
Distributed under the MIT License.

---
Built with ❤️ by [Jiten Koundinye](https://github.com/Jitenkoundinye2004)
