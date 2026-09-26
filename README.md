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
How to Run
1. Install Node.js

Make sure Node.js is installed on your system.

2. Open the Backend Folder

Open the project in VS Code and open the terminal.

cd backend
3. Install Dependencies
npm install
4. Start the Backend Server
node server.js

The server will run at:

http://localhost:3000
5. Open the Website

Open index.html in your browser.

Task Board

The application provides three task status categories:

To Do
In Progress
Completed

Users can change the task status and delete tasks.

Database

The project uses SQLite to store:

Users
Projects
Tasks
Comments
Project Status

Completed
