// Get form
const form = document.getElementById("studentForm");

// Check form exists
if (form) {

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get student data
        const student = {
            firstname: document.getElementById("firstname").value.trim(),
            lastname: document.getElementById("lastname").value.trim(),
            matricNumber: document.getElementById("matricNumber").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            dateofbirth: document.getElementById("dateofbirth").value,
            gender: document.getElementById("gender").value,
            address: document.getElementById("address").value.trim()
        };

        try {
            const response = await fetch(
                "http://localhost:3000/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Student registered successfully!");

                form.reset();
            } else {
                alert(data.message || "Failed to register student.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Unable to connect to the server.");
        }
    });

}