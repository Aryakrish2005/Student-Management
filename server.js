
const express = require("express");

const app = express();
const PORT = 3001;

// Read JSON data sent by the frontend
app.use(express.json());

// Serve frontend files from public folder
app.use(express.static("public"));



const path = require("path");



// Serve HTML, CSS, and JavaScript files
app.use(express.static(path.join(__dirname, "public")));

// Your API routes go below
app.get("/api/tasks", (req, res) => {
    res.json({ message: "Tasks loaded successfully" });
});

module.exports = app;

// Temporary student data
let students = [
    { id: 1, name: "Anu", course: "Computer Science" },
    { id: 2, name: "Rahul", course: "Commerce" }
];

// GET: View all students
app.get("/students", (req, res) => {
    res.json(students);
});

// POST: Add a student
app.post("/students", (req, res) => {
    const { name, course } = req.body;

    if (!name || !course) {
        return res.status(400).json({
            message: "Name and course are required"
        });
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        course: course
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

// DELETE: Remove a student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const studentExists = students.some(
        student => student.id === id
    );

    if (!studentExists) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students = students.filter(
        student => student.id !== id
    );

    res.json({ message: "Student deleted successfully" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
