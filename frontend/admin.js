const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    try {
        const response = await fetch(
            "http://localhost:3000/admin/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem(
                "adminToken",
                data.token
            );

            alert("Login successful!");

            window.location.href =
                "./dashboard.html";

        } else {
            alert(
                data.message ||
                "Login failed"
            );
        }

    } catch (error) {
        console.error(error);

        alert(
            "Unable to connect to the server"
        );
    }
});