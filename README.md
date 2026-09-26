# CodeAlpha Project Management Tool

A simple full-stack Project Management Tool developed as part of the CodeAlpha internship.

## Features

- User Registration
- User Login
- Create Projects
- Create Tasks
- Assign Tasks
- Set Task Due Dates
- Task Status Management
- To Do / In Progress / Completed Task Board
- Change Task Status
- Delete Tasks
- Task Comments
- SQLite Database
- REST API using Express.js

## Technologies Used

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- SQLite3
- CORS

## Project Structure

```text
CodeAlpha_ProjectManagement/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

## How to Run

### 1. Install Node.js

Make sure Node.js is installed on your system.

### 2. Open the Project

Open the `CodeAlpha_ProjectManagement` folder in VS Code.

### 3. Open the Backend Folder

Open the VS Code terminal and run:

```bash
cd backend
```

### 4. Install Dependencies

Run:

```bash
npm install
```

### 5. Start the Backend Server

Run:

```bash
node server.js
```

The backend server will run at:

```text
http://localhost:3000
```

### 6. Open the Website

Open `index.html` in your browser.

## Task Board

The application provides three task status categories:

- To Do
- In Progress
- Completed

Users can create tasks, assign tasks, set due dates, change task status, delete tasks, and add comments.

## Database

The project uses SQLite to store:

- Users
- Projects
- Tasks
- Comments

## Project Status

**Completed**
