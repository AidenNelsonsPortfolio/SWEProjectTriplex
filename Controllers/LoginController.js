const loginButton = document.getElementById("login-button");
const loginPopup = document.getElementById("login-popup");
const closeButton = document.getElementById("close-login-button");
const logIn = document.getElementById("log-in");

const signUp = document.getElementById("sign-up");
const signUpPopup = document.getElementById("sign-up-popup");
const closeSignUp = document.getElementById("close-sign-up");
const createAccount = document.getElementById("create-account");

//When user button is clicked, open login popup
loginButton.addEventListener("click", () => {
    loginPopup.style.display = "flex";
});

//When close button clicked, hide login popup
closeButton.addEventListener("click", () => {
    loginPopup.style.display = "none";
});

//When logIn button clicked, closes loginPopup and logs user in
logIn.addEventListener("click", () => {
    loginPopup.style.display = "none";

});

//When sign up button is clicked, hide login popup and display sign up popup
signUp.addEventListener("click", () => {
    loginPopup.style.display = "none";
    signUpPopup.style.display = "flex";
});

//When closeSignUp clicked, closes sign up popup and re-opens login popup
closeSignUp.addEventListener("click", () => {
    signUpPopup.style.display = "none";
    loginPopup.style.display = "flex";
});

//When createAccount clicked, close sign up popup and re-open login popup to have user login
createAccount.addEventListener("click", () => {
    signUpPopup.style.display = "none";
    loginPopup.style.display = "flex";
});