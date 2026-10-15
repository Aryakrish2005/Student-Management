
const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentCourse = document.getElementById("studentCourse");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

let students = [];

// Show success or error messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// GET: Fetch all students from the backend
async function loadStudents() {
    studentList.replaceChildren();

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 4;
    loadingCell.textContent = "Loading students...";
    loadingRow.appendChild(loadingCell);
    studentList.appendChild(loadingRow);

    try {
        const response = await fetch("/students");

        if (!response.ok) {
            throw new Error("Could not load students");
        }

        students = await response.json();
        displayStudents();
    } catch (error) {
        studentList.replaceChildren();
        showMessage(
            "Could not load students. Check whether the server is running.",
            "error"
        );
    }
}

// Display students in the table
function displayStudents() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.course.toLowerCase().includes(searchText)
    );

    studentList.replaceChildren();

    if (filteredStudents.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.className = "empty-message";
        cell.textContent = "No students found";

        row.appendChild(cell);
        studentList.appendChild(row);
        return;
    }

    filteredStudents.forEach(student => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = student.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        const courseCell = document.createElement("td");
        courseCell.textContent = student.course;

        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = student.id;

        actionCell.appendChild(deleteBtn);

        row.append(idCell, nameCell, courseCell, actionCell);
        studentList.appendChild(row);
    });
}

// POST: Add a student
studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = studentName.value.trim();
    const course = studentCourse.value.trim();

    if (!name || !course) {
        showMessage("Please enter both name and course.", "error");
        return;
    }

    submitBtn.disabled = true;

    try {
        const response = await fetch("/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, course })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not add student");
        }

        studentForm.reset();
        showMessage("Student added successfully!", "success");

        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        submitBtn.disabled = false;
    }
});

// DELETE: Delete a student
studentList.addEventListener("click", async function (event) {
    const button = event.target.closest(".delete-btn");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    button.disabled = true;

    try {
        const response = await fetch(
            `/students/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not delete student");
        }

        showMessage("Student deleted successfully!", "success");
        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
        button.disabled = false;
    }
});

// Search students while typing
searchInput.addEventListener("input", displayStudents);

// Load students when the page opens
loadStudents();
