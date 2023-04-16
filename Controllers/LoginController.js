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

const errorTextSignin = document.getElementById("error-text-signin");
const errorTextSignup = document.getElementById("error-text-signup");


var currentUsername = "";
var justSignedOut = false;

//When close button clicked, hide login popup
closeButton.addEventListener("click", () => {
    loginPopup.style.display = "none";
});

//When close button clicked, hide sign up popup
closeSignoutButton.addEventListener("click", () => {
    signOutPopup.style.display = "none";
});

//Get all game-button elements, close the login popup or sign up popup if it is open, and add an event listener to each button
const gameButtons = document.getElementsByClassName("game-button");
for (let i = 0; i < gameButtons.length; i++) {
    gameButtons[i].addEventListener("click", () => {
        loginPopup.style.display = "none";
        signUpPopup.style.display = "none";
        signOutPopup.style.display = "none";
    });
}

function deleteEntries() {
    //Delete all data in form fields
    document.getElementById("signInEmail").value = "";
    document.getElementById("signInPassword").value = "";
    document.getElementById("signUpEmail").value = "";
    document.getElementById("signUpPassword").value = "";
    document.getElementById("signUpConfirmPassword").value = "";
    document.getElementById("signUpUsername").value = "";
}

function displaySignInPopup() {
    loginPopup.style.display = "flex";
    //Close the sign up popup if it is open
    signUpPopup.style.display = "none";
}

function displaySignOutPopup() {
    personalSignOut.textContent = "" + currentUsername;
    signOutPopup.style.display = "flex";
    //Close the login popup if it is open
    loginPopup.style.display = "none";
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
            blurredBackground.style.visibility = "hidden";
            welcomeMessage.style.visibility = "hidden";
        }, 500);
    }, 3000);
}

function showLoggedOutMessage() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const blurredBackground = document.getElementById("blurredBackground");

    if(justSignedOut) {
        welcomeMessage.textContent = "You have been signed out.";
        justSignedOut = false;
    }
    else {
        welcomeMessage.textContent = "Welcome to Triplex!";
    }


    // Create a new line using <br> element
    const newLine = document.createElement("br");
    welcomeMessage.appendChild(newLine);

    // Create a <span> element with the desired text and styles. Remove the reverse-gradient-text class
    const secondaryWelcome = document.createElement("span");
    secondaryWelcome.classList.remove("reverse-gradient-text");
    secondaryWelcome.textContent = "Log in to track your scores!";

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
        }, 500);
    }, 3000);
}

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Close the login popup if it is open
        loginPopup.style.display = "none";
        
        try {
            // Get the user's username and display it in the welcome message
            const username = await getUsername(user.uid);
            showWelcomeMessage(username);
            currentUsername = username;
        } catch (error) {
            console.error('Error getting username:', error);
        }

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

    //Simulate that someone pressed the home button
    document.getElementById("home-button").click();
});


signOutButton.addEventListener("click", async () => {
    signOutPopup.style.display = "none";
    justSignedOut = true;

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
    
    //Check that all fields are filled in
    if (email == null || email == "" || password == null || password || ""){
        errorTextSignin.innerHTML = "Must fill in all fields.";
        errorTextSignin.style.display = "block";
        return;   
    }
    
    //Call the signInWithEmailPassword function from firebase-functions.js
    signInWithEmailPassword(email, password)
        .then(() => {
            loginPopup.style.display = "none";
            errorTextSignin.style.display = "none";
            errorTextSignup.style.display = "none";
            deleteEntries();
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorTextSignin.innerHTML = "Email and/or password not recognized.";
                errorTextSignin.style.display = "block";
                console.log("Email and/or password not recognized.");
            } else {
                console.log("Other error:", error.message);
            }
    });
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
    loginPopup.style.display = "none";
});

//When createAccount clicked try to create account with firebase
createAccount.addEventListener("click", async () => {
    const signUpEmail = document.getElementById("signUpEmail").value;
    const signUpPassword = document.getElementById("signUpPassword").value;
    const signUpConfirmPassword = document.getElementById("signUpConfirmPassword").value;
    const signUpUsername = document.getElementById("signUpUsername").value;
    
    //Check that all fields are filled in
    if(signUpEmail == null  || signUpEmail == "" || signUpPassword == null || signUpPassword == "" || signUpConfirmPassword == null || signUpConfirmPassword == "" || signUpUsername == null || signUpUsername == ""){
        errorTextSignup.innerHTML = "Must fill in all fields.";
        errorTextSignup.style.display = "block";
        return;
    }
    
    //Check if the passwords match
    if (signUpPassword !== signUpConfirmPassword) {
        errorTextSignup.innerHTML = "Passwords do not match.";
        errorTextSignup.style.display = "block";
        return;
    }
    
    

    currentUsername = signUpUsername;

    //Sign up via function from firebase-functions.js
    await signUpWithEmailAndPassword(signUpEmail, signUpPassword, signUpUsername)
        .then(() => {
            signUpPopup.style.display = "none";
            errorTextSignin.style.display = "none";
            errorTextSignup.style.display = "none";
            deleteEntries();
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                errorTextSignup.innerHTML = "Email already in use.";
                errorTextSignup.style.display = "block";
                console.log("Email already in use.");
            } else if (error.code === 'auth/invalid-email') {
                errorTextSignup.innerHTML = "Invalid email.";
                errorTextSignup.style.display = "block";
                console.log("Invalid email.");
            } else if (error.code === 'auth/weak-password') {
                errorTextSignup.innerHTML = "Password must be at least 6 characters.";
                errorTextSignup.style.display = "block";
                console.log("Password must be at least 6 characters.");
            } else {
                console.log("Other error:", error.message);
            }
    });
});


//Get both Google buttons and add event listeners to them (the GoogleSignIn function is in firebase-functions.js)
const googleSignInButtons = document.getElementsByClassName("google");

for (let i = 0; i < googleSignInButtons.length; i++) {
    googleSignInButtons[i].addEventListener("click", async (event) => {
        //Prevent the default action of the button
        event.preventDefault();
        //Call the signInWithGoogle function from firebase-functions.js
        await signInWithGoogle()
            .then(() => {
                loginPopup.style.display = "none";
                signUpPopup.style.display = "none";
                errorTextSignin.style.display = "none";
                errorTextSignup.style.display = "none";
                deleteEntries();
            })
            .catch((error) => {
                errorTextSignin.innerHTML = "Google sign in failed.";
                errorTextSignin.style.display = "block";
                errorTextSignup.innerHTML = "Google sign in failed.";
                errorTextSignup.style.display = "block";
                console.log(error.message);
            });

    });
}
