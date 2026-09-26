const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./projectmanagement.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {

    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Projects table
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);

    // Tasks table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            assignee TEXT,
            due_date TEXT,
            status TEXT DEFAULT 'To Do',
            project_id INTEGER,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )
    `);

    // Comments table
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            username TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks(id)
        )
    `);
});


// Test route
app.get("/", (req, res) => {
    res.send("Project Management Tool Backend is running.");
});


// Register user
app.post("/api/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    const sql = `
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `;

    db.run(sql, [username, password], function(err) {

        if (err) {

            if (err.message.includes("UNIQUE")) {
                return res.status(400).json({
                    message: "Username already exists."
                });
            }

            return res.status(500).json({
                message: err.message
            });
        }

        res.json({
            message: "User registered successfully.",
            userId: this.lastID
        });
    });
});


// Login user
app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT id, username
        FROM users
        WHERE username = ? AND password = ?
    `;

    db.get(sql, [username, password], (err, user) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        res.json({
            message: "Login successful.",
            user: user
        });
    });
});


// Create project
app.post("/api/projects", (req, res) => {

    const { name, description, created_by } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Project name is required."
        });
    }

    const sql = `
        INSERT INTO projects (name, description, created_by)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [name, description || "", created_by || null],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Project created successfully.",
                projectId: this.lastID
            });
        }
    );
});


// Get projects
app.get("/api/projects", (req, res) => {

    db.all(
        "SELECT * FROM projects ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});


// Create task
app.post("/api/tasks", (req, res) => {

    const {
        title,
        description,
        assignee,
        due_date,
        status,
        project_id
    } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Task title is required."
        });
    }

    const sql = `
        INSERT INTO tasks
        (title, description, assignee, due_date, status, project_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            title,
            description || "",
            assignee || "",
            due_date || "",
            status || "To Do",
            project_id || null
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Task created successfully.",
                taskId: this.lastID
            });
        }
    );
});


// Get tasks
app.get("/api/tasks", (req, res) => {

    db.all(
        "SELECT * FROM tasks ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});
// ==================== UPDATE TASK STATUS ====================

app.put("/api/tasks/:id/status", (req, res) => {

    const taskId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status is required."
        });
    }

    db.run(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [status, taskId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Task not found."
                });
            }

            res.json({
                message: "Task status updated successfully."
            });
        }
    );
});


// ==================== DELETE TASK ====================

app.delete("/api/tasks/:id", (req, res) => {

    const taskId = req.params.id;

    db.run(
        "DELETE FROM tasks WHERE id = ?",
        [taskId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Task not found."
                });
            }

            res.json({
                message: "Task deleted successfully."
            });
        }
    );
});

// Add comment to task
app.post("/api/comments", (req, res) => {

    const {
        task_id,
        username,
        comment
    } = req.body;

    if (!task_id || !username || !comment) {
        return res.status(400).json({
            message: "Task, username and comment are required."
        });
    }

    const sql = `
        INSERT INTO comments
        (task_id, username, comment)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [task_id, username, comment],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Comment added successfully.",
                commentId: this.lastID
            });
        }
    );
});


// Get comments for a task
app.get("/api/comments/:taskId", (req, res) => {

    const taskId = req.params.taskId;

    db.all(
        `
        SELECT *
        FROM comments
        WHERE task_id = ?
        ORDER BY id ASC
        `,
        [taskId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});


app.listen(PORT, () => {
    console.log(
        `Project Management server running at http://localhost:${PORT}`
    );
});