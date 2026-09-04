const messageList = document.getElementById("messageList");
const logoutButton = document.getElementById("logoutButton");

// Your deployed backend URL
const API_URL =
    "https://final-full-stack-project-1.onrender.com";

// Get admin token
const token = localStorage.getItem("adminToken");

// Check admin login
if (!token) {
    window.location.href = "./admin.html";
}

// Logout
logoutButton.addEventListener("click", function () {
    localStorage.removeItem("adminToken");

    alert("You have been logged out!");

    window.location.href = "./admin.html";
});

// Load messages
document.addEventListener("DOMContentLoaded", getMessages);

// Get messages
async function getMessages() {
    try {

        const response = await fetch(
            `${API_URL}/contacts`,
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

        const messages = await response.json();

        messageList.innerHTML = "";

        if (messages.length === 0) {
            messageList.innerHTML =
                "<p>No messages yet.</p>";

            return;
        }

        messages.forEach(function (message) {

            messageList.innerHTML += `
                <div class="message-card">

                    <div class="message-header">
                        <h3>${message.name}</h3>
                        <p>${message.email}</p>
                    </div>

                    <div class="message-content">
                        <h4>Message</h4>
                        <p>${message.message}</p>
                    </div>

                    <div class="reply-section">

                        <h4>Admin Reply</h4>

                        <textarea
                            id="reply-${message._id}"
                            placeholder="Write your reply here..."
                        >${message.reply || ""}</textarea>

                        <button
                            class="reply-button"
                            onclick="replyMessage('${message._id}')"
                        >
                            Save Reply
                        </button>

                        <button
                            class="delete-message-button"
                            onclick="deleteMessage('${message._id}')"
                        >
                            Delete Message
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);

        messageList.innerHTML =
            "<p>Unable to load messages. Please try again later.</p>";
    }
}

// Save reply
async function replyMessage(id) {

    const reply = document
        .getElementById(`reply-${id}`)
        .value
        .trim();

    if (!reply) {
        alert("Please write a reply first.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/contacts/${id}/reply`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },

                body: JSON.stringify({
                    reply: reply
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(
                data.message ||
                "Reply saved successfully!"
            );

            getMessages();

        } else {

            alert(
                data.message ||
                "Failed to save reply"
            );
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }
}

// Delete message
async function deleteMessage(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/contacts/${id}`,
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
                "Message deleted successfully!"
            );

            getMessages();

        } else {

            alert(
                data.message ||
                "Failed to delete message"
            );
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }
}