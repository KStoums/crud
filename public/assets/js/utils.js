function sendError(error) {
    let errorSuccessBlock = document.getElementById("error-success-block");
    errorSuccessBlock.style.background = "#F10000";
    errorSuccessBlock.innerHTML = error;
    errorSuccessBlock.classList.remove("hidden");
}

function sendSuccess(message) {
    let errorSuccessBlock = document.getElementById("error-success-block");
    errorSuccessBlock.style.background = "#00CB28";
    errorSuccessBlock.innerHTML = message;
    errorSuccessBlock.classList.remove("hidden");
}