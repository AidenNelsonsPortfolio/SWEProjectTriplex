//Import the functions from firebase-functions.js
import { signUpWithEmailAndPassword, signInWithEmailPassword, signInWithGoogle, getUsername, getCurrentUser, auth, signOut } from "../firebase-functions.js";

const loginButton = document.getElementById("login-button");
const loginPopup = document.getElementById("login-popup");
const closeButton = document.getElementById("close-login-button");
const logIn = document.getElementById("log-in");

const signOutPopup = document.getElementById("signout-popup");
const signOutButton = document.getElementById("signout-button");
const closeSignoutButton = document.getElementById("close-signout-button");
const personalSignOut = document.getElementById("personalSignOut");

const signUp = document.getElementById("sign-up");
const signIn = document.getElementById("sign-in");
const signUpPopup = document.getElementById("sign-up-popup");
const closeSignUp = document.getElementById("close-sign-up");
const createAccount = document.getElementById("create-account");

var currentUsername = "";

//When close button clicked, hide login popup
closeButton.addEventListener("click", () => {
    loginPopup.style.display = "none";
});

//When close button clicked, hide sign up popup
closeSignoutButton.addEventListener("click", () => {
    signOutPopup.style.display = "none";
});


function displaySignInPopup() {
    console.log("Sign in popup displayed");
    loginPopup.style.display = "flex";
}

function displaySignOutPopup() {
    console.log("Sign out popup displayed");
    personalSignOut.textContent = "" + currentUsername;
    signOutPopup.style.display = "flex";
}

// Function to show the welcome message
function showWelcomeMessage(displayName) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const blurredBackground = document.getElementById("blurredBackground");

    welcomeMessage.textContent = `Welcome to Triplex, ${displayName}!`;

    // Show the welcome message and blur the background
    welcomeMessage.style.visibility = "visible";
    blurredBackground.style.visibility = "visible";

    requestAnimationFrame(() => {
        welcomeMessage.style.opacity = 1;
        blurredBackground.style.opacity = 1;
    });

    // Hide the welcome message after 3 seconds
    setTimeout(() => {
        welcomeMessage.style.opacity = 0;
        blurredBackground.style.opacity = 0;
        // Hide the welcome message and unblur the background after 0.5 seconds
        setTimeout(() => {
            blurredBackground.style.display = "none";
            welcomeMessage.style.display = "none";
        }, 500);
    }, 2500);
}

function showLoggedOutMessage() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const blurredBackground = document.getElementById("blurredBackground");

    welcomeMessage.textContent = `Welcome to Triplex!`;

    // Create a new line using <br> element
    const newLine = document.createElement("br");
    welcomeMessage.appendChild(newLine);

    // Create a <span> element with the desired text and styles. Remove the reverse-gradient-text class
    const secondaryWelcome = document.createElement("span");
    secondaryWelcome.classList.remove("reverse-gradient-text");
    secondaryWelcome.textContent = "Log in for tracking scores!";

    // Override the background-related styles
    secondaryWelcome.style.fontSize = "2rem";
    secondaryWelcome.style.background = "none";
    secondaryWelcome.style.webkitBackgroundClip = "initial";
    secondaryWelcome.style.backgroundClip = "initial";
    secondaryWelcome.style.webkitTextFillColor = "white";
    secondaryWelcome.style.mozTextFillColor = "white";
    secondaryWelcome.style.msTextFillColor = "white";
    secondaryWelcome.style.oTextFillColor = "white";

    // Append the <span> element to the div
    welcomeMessage.appendChild(secondaryWelcome);

    // Show the welcome message and blur the background
    welcomeMessage.style.visibility = "visible";
    blurredBackground.style.visibility = "visible";

    requestAnimationFrame(() => {
        welcomeMessage.style.opacity = 1;
        blurredBackground.style.opacity = 1;
    });

    // Hide the welcome message after 3 seconds
    setTimeout(() => {
        welcomeMessage.style.opacity = 0;
        blurredBackground.style.opacity = 0;
        // Hide the welcome message and unblur the background after 0.5 seconds
        setTimeout(() => {
            //Remove the secondary welcome message
            welcomeMessage.removeChild(newLine);
            welcomeMessage.removeChild(secondaryWelcome);

            blurredBackground.style.visibility = "hidden";
            welcomeMessage.style.visibility = "hidden";
            secondaryPersonalSignOut.style.display = "none";
        }, 500);
    }, 2500);
}

auth.onAuthStateChanged((user) => {
    if (user) {
        // Close the login popup if it is open
        loginPopup.style.display = "none";
        
        // Get the user's username and display it in the welcome message
        getUsername(user.uid).then((username) => {
            showWelcomeMessage(username);
            currentUsername = username;
        });

        console.log("User signed in");

        // Add the event listener for the sign out popup
        loginButton.addEventListener("click", displaySignOutPopup);
        // Remove the event listener for the sign in popup
        loginButton.removeEventListener("click", displaySignInPopup);
    } else {

        showLoggedOutMessage();

        // Close the sign out popup if it is open`
        signOutPopup.style.display = "none";

        console.log("User is signed out");

        // Add the event listener for the sign in popup
        loginButton.addEventListener("click", displaySignInPopup);
        // Remove the event listener for the sign out popup
        loginButton.removeEventListener("click", displaySignOutPopup);
    }
});


signOutButton.addEventListener("click", async () => {
    signOutPopup.style.display = "none";
    //Call the signOut function from firebase-functions.js
    await signOut().catch((error) => {
        alert(error.message);
    });
});


//When logIn button clicked, closes loginPopup and logs user in
logIn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;
    //Call the signInWithEmailPassword function from firebase-functions.js
    signInWithEmailPassword(email, password)
        .then(async (user) => {
            // Get the user's username and alert it
            const retrievedUsername = await getUsername(user.uid);
            alert("Signed in successfully with username: " + retrievedUsername);
        
            loginPopup.style.display = "none";
        })
        .catch((error) => {
            alert(error.message);
        }
    );
});

//When sign up button is clicked, hide login popup and display sign up popup
signUp.addEventListener("click", () => {
    loginPopup.style.display = "none";
    signUpPopup.style.display = "flex";
});

//When the sign in button is clicked, hide sign up popup and display login popup
signIn.addEventListener("click", () => {
    signUpPopup.style.display = "none";
    loginPopup.style.display = "flex";
});

//When closeSignUp clicked, closes sign up popup and re-opens login popup
closeSignUp.addEventListener("click", () => {
    signUpPopup.style.display = "none";
    loginPopup.style.display = "flex";
});

//When createAccount clicked try to create account with firebase
createAccount.addEventListener("click", () => {
    const signUpEmail = document.getElementById("signUpEmail").value;
    const signUpPassword = document.getElementById("signUpPassword").value;
    const signUpConfirmPassword = document.getElementById("signUpConfirmPassword").value;
    const signUpUsername = document.getElementById("signUpUsername").value;

    //Check if the passwords match
    if (signUpPassword !== signUpConfirmPassword) {
        alert("Passwords do not match");
        return;
    }

    //Sign up via function from firebase-functions.js
    signUpWithEmailAndPassword(signUpEmail, signUpPassword, signUpUsername)
        .then(async (user) => {
            // Get the user's username and alert it
            const retrievedUsername = await getUsername(user.uid);
            alert("Signed in successfully with username: " + retrievedUsername);    
        })
        .catch((error) => {
            alert(error.message);
        }
    );
    signUpPopup.style.display = "none";
    loginPopup.style.display = "flex";
});


//Get both Google buttons and add event listeners to them (the GoogleSignIn function is in firebase-functions.js)
const googleSignInButtons = document.getElementsByClassName("google");

for (let i = 0; i < googleSignInButtons.length; i++) {
    googleSignInButtons[i].addEventListener("click", (event) => {
        //Prevent the default action of the button
        event.preventDefault();
        //Call the signInWithGoogle function from firebase-functions.js
        signInWithGoogle()
            .then(async (user) => {
                // Get the user's username and alert it
                const retrievedUsername = await getUsername(user.uid);
                alert("Signed in successfully with username: " + retrievedUsername);
            })
            .catch((error) => {
                alert(error.message);
            }
        );
    });
}
