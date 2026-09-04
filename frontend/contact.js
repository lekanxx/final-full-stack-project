const contactForm = document.getElementById("contactForm");

// Send contact message
contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document
        .getElementById("contactName")
        .value
        .trim();

    const email = document
        .getElementById("contactEmail")
        .value
        .trim();

    const message = document
        .getElementById("message")
        .value
        .trim();

    try {
        const response = await fetch(
            "http://localhost:3000/contacts",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(data.message);

            // Clear the form
            contactForm.reset();

        } else {
            alert(data.message || "Failed to send message");
        }

    } catch (error) {
        console.error(error);

        alert("Unable to connect to the server");
    }
});