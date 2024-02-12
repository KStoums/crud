(async () => {
   if (!await checkIfLogged()) {
       return;
   }

    let connectedSubtitle = document.getElementById("connected");
    let disconnectButton = document.getElementById("disconnect");

    connectedSubtitle.classList.remove("hidden");
    disconnectButton.classList.remove("hidden");

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