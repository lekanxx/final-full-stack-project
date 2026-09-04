const studentList = document.getElementById("studentList");
const editSection = document.getElementById("editSection");
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");
const logoutButton = document.getElementById("logoutButton");
const searchStudent = document.getElementById("searchStudent");
const studentCount = document.getElementById("studentCount");

// Store students
let allStudents = [];

// Get token
const token = localStorage.getItem("adminToken");

// Check login
if (!token) {
    window.location.href = "./admin.html";
}

// Logout
logoutButton.addEventListener("click", function () {
    localStorage.removeItem("adminToken");

    alert("You have been logged out!");

    window.location.href = "./admin.html";
});

// Hide edit form
editSection.style.display = "none";

// Load students
document.addEventListener("DOMContentLoaded", getStudents);

// Search students
searchStudent.addEventListener("input", function () {
    const searchValue = searchStudent.value
        .trim()
        .toLowerCase();

    const filteredStudents = allStudents.filter(function (student) {
        const fullname =
            `${student.firstname || ""} ${student.lastname || ""}`
                .toLowerCase();

        const studentId =
            (student.studentId || "").toLowerCase();

        const matricNumber =
            (student.matricNumber || "").toLowerCase();

        const email =
            (student.email || "").toLowerCase();

        return (
            fullname.includes(searchValue) ||
            studentId.includes(searchValue) ||
            matricNumber.includes(searchValue) ||
            email.includes(searchValue)
        );
    });

    displayStudents(filteredStudents);
});

// Get students
async function getStudents() {
    try {
        const response = await fetch(
            "http://localhost:3000/students",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (
            response.status === 401 ||
            response.status === 403
        ) {
            localStorage.removeItem("adminToken");

            window.location.href = "./admin.html";

            return;
        }

        const students = await response.json();

        allStudents = students;

        studentCount.textContent = students.length;

        displayStudents(allStudents);

    } catch (error) {
        console.error(error);

        studentList.innerHTML =
            "<p>Unable to load students. Make sure your server is running.</p>";
    }
}

// Display students
function displayStudents(students) {
    studentList.innerHTML = "";

    if (students.length === 0) {
        studentList.innerHTML =
            "<p>No students found.</p>";

        return;
    }

    students.forEach(function (student) {

        studentList.innerHTML += `
            <div class="student-card">

                <div class="student-header">

                    <span class="student-id">
                        Student ID: ${student.studentId || "Not available"}
                    </span>

                    <h3>
                        ${student.firstname || ""}
                        ${student.lastname || ""}
                    </h3>

                </div>

                <div class="student-info">

                    <p>
                        <strong>Matric Number:</strong>
                        ${student.matricNumber || "Not provided"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${student.email || "Not provided"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${student.phone || "Not provided"}
                    </p>

                    <p>
                        <strong>Date of Birth:</strong>
                        ${student.dateofbirth || "Not provided"}
                    </p>

                    <p>
                        <strong>Gender:</strong>
                        ${student.gender || "Not provided"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${student.address || "Not provided"}
                    </p>

                </div>

                <div class="student-actions">

                    <button
                        class="edit-button"
                        onclick="editStudent('${student._id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteStudent('${student._id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}

// Edit student
function editStudent(id) {

    const student = allStudents.find(function (student) {
        return student._id === id;
    });

    if (!student) {
        alert("Student not found.");
        return;
    }

    document.getElementById("editId").value =
        student._id;

    document.getElementById("editStudentId").value =
        student.studentId || "";

    document.getElementById("editFirstname").value =
        student.firstname || "";

    document.getElementById("editLastname").value =
        student.lastname || "";

    document.getElementById("editMatricNumber").value =
        student.matricNumber || "";

    document.getElementById("editEmail").value =
        student.email || "";

    document.getElementById("editPhone").value =
        student.phone || "";

    document.getElementById("editDateofbirth").value =
        student.dateofbirth || "";

    document.getElementById("editGender").value =
        student.gender || "";

    document.getElementById("editAddress").value =
        student.address || "";

    // Show form
    editSection.style.display = "block";

    editSection.scrollIntoView({
        behavior: "smooth"
    });
}

// Update student
editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id =
        document.getElementById("editId").value;

    const student = {
        studentId:
            document.getElementById("editStudentId")
                .value
                .trim(),

        firstname:
            document.getElementById("editFirstname")
                .value
                .trim(),

        lastname:
            document.getElementById("editLastname")
                .value
                .trim(),

        matricNumber:
            document.getElementById("editMatricNumber")
                .value
                .trim(),

        email:
            document.getElementById("editEmail")
                .value
                .trim(),

        phone:
            document.getElementById("editPhone")
                .value
                .trim(),

        dateofbirth:
            document.getElementById("editDateofbirth")
                .value,

        gender:
            document.getElementById("editGender")
                .value,

        address:
            document.getElementById("editAddress")
                .value
                .trim()
    };

    try {
        const response = await fetch(
            `http://localhost:3000/students/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },

                body: JSON.stringify(student)
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(
                data.message ||
                "Student updated successfully!"
            );

            editSection.style.display = "none";

            editForm.reset();

            getStudents();

        } else {
            alert(
                data.message ||
                "Failed to update student."
            );
        }

    } catch (error) {
        console.error(error);

        alert("Unable to connect to the server.");
    }
});

// Delete student
async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/students/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(
                data.message ||
                "Student deleted successfully!"
            );

            getStudents();

        } else {
            alert(
                data.message ||
                "Failed to delete student."
            );
        }

    } catch (error) {
        console.error(error);

        alert("Unable to connect to the server.");
    }
}

// Cancel editing
cancelEdit.addEventListener("click", function () {

    editSection.style.display = "none";

    editForm.reset();
});