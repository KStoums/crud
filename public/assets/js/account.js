(async () => {
   if (!await checkIfLogged()) {
       return;
   }

    let connectedSubtitle = document.getElementById("connected");
    let disconnectButton = document.getElementById("disconnect");
    let editPassword = document.getElementById("edit-password");
    let deleteAccount = document.getElementById("delete-account");

    connectedSubtitle.classList.remove("hidden");
    disconnectButton.classList.remove("hidden");
    editPassword.classList.remove("hidden");
    deleteAccount.classList.remove("hidden");

    let disconnectedSubtitle = document.getElementById("disconnected");
    let loginButton = document.getElementById("login");

    disconnectedSubtitle.classList.add("hidden");
    loginButton.classList.add("hidden");
})();

async function disconnect() {
    try {
        const response = await fetch("http://localhost:3000/disconnect", {
            method: "POST",
            credentials: "include",
        });

        const responseJson = await response.json();

        if (!response.ok) {
            sendError("Error: " + responseJson["error"]);
            return;
        }

        location.reload();
    } catch (error) {
        sendError("Error: An error has occurred, please try again later");
    }
}

function editPassword() {
    const secondPage = document.getElementById("second-page");
    secondPage.classList.toggle("hidden");
}

async function sendNewPassword() {
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-new-password").value;

    if (newPassword !== confirmNewPassword) {
        sendError("Error: Passwords are not identical");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/password", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({newPassword:newPassword}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const responseJson = await response.json();

        if (!response.ok) {
            sendError("Error: " + responseJson["error"]);
            return;
        }

        sendSuccess("Your password has been successfully changed!");
        await disconnect();
    } catch (error) {
        sendError("Error: An error has occurred, please try again later");
    }
}


function cancelEditPassword() {
    const secondPage = document.getElementById("second-page");
    secondPage.classList.toggle("hidden");
}

async function deleteAccount() {
    //Implements logic
}

async function checkIfLogged() {
    try {
        const response = await fetch("http://localhost:3000/me", {
            method: "GET",
            credentials: "include",
        });

        const responseJson = await response.json();

        if (!response.ok) {
            sendError("Error: " + responseJson["error"]);
            return false;
        }
        return true;
    } catch (error) {
        sendError("Error: An error has occurred, please try again later");
        return false;
    }
}