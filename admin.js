const adminLoginForm =
    document.getElementById("adminLoginForm");

// Backend URL
const API_URL =
    "https://final-full-stack-project-1.onrender.com";

// Admin login
if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("adminPassword")
                    .value;

            try {

                const response = await fetch(
                    `${API_URL}/admin/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

                const data =
                    await response.json();

                if (response.ok) {

                    // Save admin token
                    localStorage.setItem(
                        "adminToken",
                        data.token
                    );

                    alert(
                        "Login successful!"
                    );

                    // Go to dashboard
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
        }
    );
}