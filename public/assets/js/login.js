async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const emailRegex = /^([a-zA-Z0-9_\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/;

    if (!email.match(emailRegex)) {
        sendError("Error: Your email address is invalid");
        return;
    }

    if (email === "" || password === "") {
        sendError("Error: You must enter an email address and a password");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({email: email, password: password}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const responseJson = await response.json();

        if (!response.ok) {
            sendError("Error: " + responseJson["error"]);
            return;
        }

        sendSuccess("Connection successful, redirection in progress...");
        setTimeout(() => {
            window.location.href = "account.html";
        }, 3000);
    } catch (error) {
        sendError("Error: An error has occurred, please try again later");
    }
}