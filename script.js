const API = "http://localhost:3000/api";

let currentUser = null;
let projects = [];
let tasks = [];


// ==================== LOGIN ====================

async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("loginMessage");

    if (!username || !password) {

        message.textContent =
            "Please enter username and password.";

        return;
    }

    try {

        const response =
            await fetch(`${API}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            });

        const data =
            await response.json();

        if (!response.ok) {

            message.textContent =
                data.message;

            return;
        }

        currentUser = data.user;

        message.textContent =
            "Login successful! Welcome " +
            currentUser.username;

    } catch (error) {

        message.textContent =
            "Backend connection failed.";

        console.error(error);
    }
}


// ==================== REGISTER ====================

async function registerUser() {

    const username =
        document.getElementById("registerUsername").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const message =
        document.getElementById("registerMessage");

    if (!username || !password) {

        message.textContent =
            "Please enter username and password.";

        return;
    }

    try {

        const response =
            await fetch(`${API}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

        const data =
            await response.json();

        message.textContent =
            data.message;

        if (response.ok) {

            document.getElementById(
                "registerUsername"
            ).value = "";

            document.getElementById(
                "registerPassword"
            ).value = "";
        }

    } catch (error) {

        message.textContent =
            "Backend connection failed.";

        console.error(error);
    }
}


// ==================== CREATE PROJECT ====================

async function createProject() {

    const name =
        document.getElementById("projectName").value.trim();

    const description =
        document.getElementById("projectDescription").value.trim();

    if (!name) {

        alert("Please enter a project name.");

        return;
    }

    try {

        const response =
            await fetch(`${API}/projects`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    description: description,

                    created_by:
                        currentUser ? currentUser.id : null
                })
            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert("Project created successfully!");

        document.getElementById(
            "projectName"
        ).value = "";

        document.getElementById(
            "projectDescription"
        ).value = "";

        loadProjects();

    } catch (error) {

        alert("Unable to connect to backend.");

        console.error(error);
    }
}


// ==================== LOAD PROJECTS ====================

async function loadProjects() {

    try {

        const response =
            await fetch(`${API}/projects`);

        projects =
            await response.json();

        displayProjects();

    } catch (error) {

        console.error(error);
    }
}


// ==================== DISPLAY PROJECTS ====================

function displayProjects() {

    const container =
        document.getElementById("projectContainer");

    container.innerHTML = "";

    projects.forEach(function(project) {

        const projectElement =
            document.createElement("div");

        projectElement.className =
            "project-card";

        projectElement.innerHTML = `

            <h3>${project.name}</h3>

            <p>
                ${project.description || ""}
            </p>

            <p>
                <strong>Project ID:</strong>
                ${project.id}
            </p>

        `;

        container.appendChild(projectElement);

    });
}


// ==================== CREATE TASK ====================

async function createTask() {

    const title =
        document.getElementById("taskTitle").value.trim();

    const assignee =
        document.getElementById("taskAssignee").value.trim();

    const dueDate =
        document.getElementById("taskDueDate").value;

    const status =
        document.getElementById("taskStatus").value;

    const description =
        document.getElementById("taskDescription").value.trim();

    if (!title) {

        alert("Please enter a task title.");

        return;
    }

    try {

        const response =
            await fetch(`${API}/tasks`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title: title,

                    description: description,

                    assignee: assignee,

                    due_date: dueDate,

                    status: status,

                    project_id: null

                })
            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert("Task created successfully!");

        document.getElementById(
            "taskTitle"
        ).value = "";

        document.getElementById(
            "taskAssignee"
        ).value = "";

        document.getElementById(
            "taskDueDate"
        ).value = "";

        document.getElementById(
            "taskDescription"
        ).value = "";

        loadTasks();

    } catch (error) {

        alert("Unable to connect to backend.");

        console.error(error);
    }
}


// ==================== LOAD TASKS ====================

async function loadTasks() {

    try {

        const response =
            await fetch(`${API}/tasks`);

        tasks =
            await response.json();

        displayTasks();

    } catch (error) {

        console.error(error);
    }
}


// ==================== DISPLAY TASKS ====================

function displayTasks() {

    const todo =
        document.getElementById("todoTasks");

    const progress =
        document.getElementById("progressTasks");

    const completed =
        document.getElementById("completedTasks");

    todo.innerHTML = "";

    progress.innerHTML = "";

    completed.innerHTML = "";

    tasks.forEach(function(task) {

        const taskElement =
            document.createElement("div");

        taskElement.className =
            "task-card";

        taskElement.innerHTML = `

            <h4>${task.title}</h4>

            <p>
                ${task.description || ""}
            </p>

            <p>
                <strong>Assigned to:</strong>
                ${task.assignee || "Not assigned"}
            </p>

            <p>
                <strong>Due:</strong>
                ${task.due_date || "No due date"}
            </p>

            <p>
                <strong>Status:</strong>
                ${task.status}
            </p>

            <button onclick="changeTaskStatus(${task.id})">
                Change Status
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete Task
            </button>

            <div class="comment-section">

                <input
                    type="text"
                    id="comment-${task.id}"
                    placeholder="Write a comment"
                >

                <button
                    onclick="addComment(${task.id})">
                    Comment
                </button>

                <div id="comments-${task.id}">
                </div>

            </div>

        `;


        // Put task into correct board column

        if (task.status === "To Do") {

            todo.appendChild(taskElement);

        } else if (task.status === "In Progress") {

            progress.appendChild(taskElement);

        } else {

            completed.appendChild(taskElement);
        }

        loadComments(task.id);

    });
}


// ==================== CHANGE TASK STATUS ====================

async function changeTaskStatus(taskId) {

    const task =
        tasks.find(function(item) {

            return item.id === taskId;

        });

    if (!task) {
        return;
    }

    let newStatus;

    if (task.status === "To Do") {

        newStatus = "In Progress";

    } else if (task.status === "In Progress") {

        newStatus = "Completed";

    } else {

        newStatus = "To Do";
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}/status`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        loadTasks();

    } catch (error) {

        alert("Unable to update task status.");

        console.error(error);
    }
}


// ==================== DELETE TASK ====================

async function deleteTask(taskId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert("Task deleted successfully!");

        loadTasks();

    } catch (error) {

        alert("Unable to delete task.");

        console.error(error);
    }
}


// ==================== ADD COMMENT ====================

async function addComment(taskId) {

    const input =
        document.getElementById(
            `comment-${taskId}`
        );

    const comment =
        input.value.trim();

    if (!comment) {

        alert("Please enter a comment.");

        return;
    }

    if (!currentUser) {

        alert("Please login before commenting.");

        return;
    }

    try {

        const response =
            await fetch(`${API}/comments`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    task_id: taskId,

                    username:
                        currentUser.username,

                    comment: comment
                })
            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        input.value = "";

        loadComments(taskId);

    } catch (error) {

        alert("Unable to add comment.");

        console.error(error);
    }
}


// ==================== LOAD COMMENTS ====================

async function loadComments(taskId) {

    try {

        const response =
            await fetch(
                `${API}/comments/${taskId}`
            );

        const comments =
            await response.json();

        const container =
            document.getElementById(
                `comments-${taskId}`
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        comments.forEach(function(item) {

            const commentElement =
                document.createElement("p");

            commentElement.innerHTML = `
                <strong>${item.username}:</strong>
                ${item.comment}
            `;

            container.appendChild(
                commentElement
            );

        });

    } catch (error) {

        console.error(error);
    }
}


// ==================== INITIAL LOAD ====================

loadProjects();

loadTasks();