# Professional To-Do List Application

A production-ready, professional task management application built with Node.js, Express, and Firebase.

## Features

- **User Authentication**: Secure Sign Up, Login, and Logout using Firebase Auth.
- **Task Management**: Create, edit, delete, and toggle tasks.
- **Categorization**: Group tasks by Work, Personal, Study, Health, or Other.
- **Prioritization**: Assign High, Medium, or Low priority levels.
- **Due Dates**: Set deadlines and track overdue tasks.
- **Productivity Dashboard**: Real-time stats, progress tracking, and daily summary.
- **Smart Filters**: Search, filter by status/category/priority, and auto-sorting.
- **Responsive Design**: Elegant white minimal theme optimized for mobile and desktop.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+), Vite.
- **Backend**: Node.js, Express.js.
- **Database**: Firebase Firestore.
- **Authentication**: Firebase Auth.

## Setup Instructions

### 1. Firebase Configuration

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore**.
4. Create a Web App and copy the config details.
5. Generate a **Service Account JSON** (Project Settings > Service Accounts) for the backend.

### 2. Environment Variables

#### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase Web App config.

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and provide the path to your service account JSON file.

### 3. Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 4. Running the App

```bash
# Start backend (from backend folder)
npm run dev

# Start frontend (from frontend folder)
npm run dev
```

## Folder Structure

- `/frontend`: Frontend source code (Vite + Vanilla JS).
- `/backend`: Backend source code (Express + Firebase Admin).
- `task.md`: Development progress tracker.
