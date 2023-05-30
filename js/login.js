const showPassword = document.querySelector(".eye-icon");
const hidePassword = document.querySelector(".eye-off-icon");
const passwordInput = document.getElementById("pass");

showPassword.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        showPassword.classList.add("eye-icon-hide");
        hidePassword.classList.add("eye-off-icon-show");
        passwordInput.type = "text";
    }
)

hidePassword.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        showPassword.classList.remove("eye-icon-hide");
        hidePassword.classList.remove("eye-off-icon-show");
        passwordInput.type = "password"; 
    }
)