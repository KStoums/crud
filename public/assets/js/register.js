async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.match(emailRegex)) {
        sendError("Error: Your email address is invalid");
        return;
    }

    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        sendError("Error: All fields must be completed");
        return;
    }

    if (password !== confirmPassword) {
        sendError("Error: Passwords are not identical");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({username: username, email: email, password: password}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const responseJson = await response.json();

        if (!response.ok) {
            sendError("Error: " + responseJson["error"]);
            return;
        }

        sendSuccess("Registration successful, you can now log in");
    } catch (error) {
        sendError("Error: An error has occurred, please try again later");
    }
}