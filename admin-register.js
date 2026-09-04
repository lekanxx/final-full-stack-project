const adminRegisterForm =
    document.getElementById("adminRegisterForm");

// Backend URL
const API_URL =
    "https://final-full-stack-project-1.onrender.com";

// Register admin
if (adminRegisterForm) {

    adminRegisterForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("adminName")
                    .value
                    .trim();

            const email =
                document.getElementById("adminEmail")
                    .value
                    .trim();

            const password =
                document.getElementById("adminPassword")
                    .value;

            const confirmPassword =
                document.getElementById("confirmPassword")
                    .value;

            // Check passwords
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/admin/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );

                const data =
                    await response.json();

                if (response.ok) {

                    alert(
                        "Admin registered successfully!"
                    );

                    adminRegisterForm.reset();

                    // Go to admin login
                    window.location.href =
                        "./admin.html";

                } else {

                    alert(
                        data.message ||
                        "Failed to register admin"
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