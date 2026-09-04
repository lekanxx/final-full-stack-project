const totalStudents = document.getElementById("totalStudents");
const totalMessages = document.getElementById("totalMessages");
const newMessages = document.getElementById("newMessages");
const repliedMessages = document.getElementById("repliedMessages");
const logoutButton = document.getElementById("logoutButton");

// Deployed backend URL
const API_URL =
    "https://final-full-stack-project-1.onrender.com";

// Get admin token
const token = localStorage.getItem("adminToken");

// Protect dashboard
if (!token) {
    window.location.href = "./admin.html";
}

// Logout
logoutButton.addEventListener("click", function () {

    localStorage.removeItem("adminToken");

    alert("You have been logged out!");

    window.location.href = "./admin.html";
});

// Load dashboard data
async function loadDashboard() {

    try {

        // Get students
        const studentsResponse = await fetch(
            `${API_URL}/students`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        // Get messages
        const messagesResponse = await fetch(
            `${API_URL}/contacts`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        // Check authentication
        if (
            studentsResponse.status === 401 ||
            studentsResponse.status === 403 ||
            messagesResponse.status === 401 ||
            messagesResponse.status === 403
        ) {

            localStorage.removeItem("adminToken");

            window.location.href = "./admin.html";

            return;
        }

        // Check for server errors
        if (
            !studentsResponse.ok ||
            !messagesResponse.ok
        ) {

            throw new Error(
                "Failed to load dashboard data"
            );
        }

        const students =
            await studentsResponse.json();

        const messages =
            await messagesResponse.json();

        // Display total students
        totalStudents.textContent =
            students.length;

        // Display total messages
        totalMessages.textContent =
            messages.length;

        // Count replied messages
        const replied =
            messages.filter(function (message) {

                return (
                    message.reply &&
                    message.reply.trim() !== ""
                );
            });

        // Count new messages
        const newMessagesCount =
            messages.filter(function (message) {

                return (
                    !message.reply ||
                    message.reply.trim() === ""
                );
            });

        repliedMessages.textContent =
            replied.length;

        newMessages.textContent =
            newMessagesCount.length;

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load dashboard data. Please try again."
        );
    }
}

// Load dashboard when page opens
document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);