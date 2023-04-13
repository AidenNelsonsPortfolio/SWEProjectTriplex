import {loadBreakout} from "../Games/breakout.js";
import {loadSnake} from "../Games/snake.js";
import {loadTetris} from "../Games/tetris.js";
import {loadHelpPopup} from "./HelpPopupController.js";
import {signInWithGoogle, signInWithEmailPassword, signUpWithEmailAndPassword, getUsername} from "../firebase-functions.js";

const game = document.getElementById("game");
const mainContent = document.getElementById("main-content");

const snakeButton = document.getElementById("snake-button");
const tetrisButton = document.getElementById("tetris-button");
const breakoutButton = document.getElementById("breakout-button");


// Sign in with email and password
function signIn(event) {
  event.preventDefault();
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;
  //Call the signInWithEmailPassword function from firebase-functions.js
  signInWithEmailPassword(email, password)
    .then(async (user) => {
      // Get the user's username and alert it
      const retrievedUsername = await getUsername(user.uid);
      alert("Signed in successfully with username: " + retrievedUsername);

      signInModal.style.display = "none";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Sign up with email and password
function signUp(event) {
  event.preventDefault();
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById("signUpConfirmPassword").value;
  const username = document.getElementById("signUpUsername").value;

  // Check if the passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  
  //Call the signUpWithEmailAndPassword function from firebase-functions.js
  signUpWithEmailAndPassword(email, password, username)
    .then(async (user) => {
      // Get the user's username and alert it
      const retrievedUsername = await getUsername(user.uid);
      alert("Signed up successfully with username: " + retrievedUsername);
      signUpModal.style.display = "none";
    })
    .catch((error) => {
      alert(error.message);
    });

}

// Open sign-in modal, called by index.html
function showSignInModal() {
  signInModal.style.display = "block";
}

// Open sign-up modal, also called by index.html
function showSignUpModal() {
  signUpModal.style.display = "block";
}

// Close modals when clicking outside of the modal content
window.onclick = function(event) {
  if (event.target === signInModal || event.target === signUpModal) {
    signInModal.style.display = "none";
    signUpModal.style.display = "none";
  }
}

// Sign up with Google
function showSignInWithGoogle() {
  console.log("Signing in with Google...");
  //Call the signInWithGoogle function from firebase-functions.js
  try{
    //Sign in with Google, then close both modals
    signInWithGoogle().then(async (user) => {
      signInModal.style.display = "none";
      signUpModal.style.display = "none";
      //Get the user's username and alert it
      const retrievedUsername = await getUsername(user.uid);
      alert("Signed in successfully with username: " + retrievedUsername);
    });    
  } catch(error){
    alert(error.message);
  }
}


//Load snake, make the canvas visible and hide the main content when the snake button is clicked
function playSnake(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="90vh";
    game.style.color = "black";
    mainContent.style.display="none";
    game.style.backgroundColor = "rgba(113, 132, 172, 0.808)";

    var animation = game.animate([
        { left: "-1000px" },
        { left: "50%" }
      ], {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards"
      });

    //creates a gradient effect from orange to pink
    // game.style.backgroundColor = "linear-gradient(90deg, orange, pink)";
    // game.style.backgroundColor = "linear-gradient(90deg, rgb(204, 171, 204), rgb(204, 155, 115))";
    
    
    //Load snake game (and audio, pause menu), from snake.js
    loadSnake();
}


//Load tetris, make the canvas visible and hide the main content when the tetris button is clicked
function playTetris(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="45vh";
    game.style.color = "black";
    mainContent.style.display="none";  
    game.style.backgroundColor = "rgb(91, 129, 123)";

    var animation = game.animate([
        { left: "-1000px" },
        { left: "50%" }
      ], {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards"
      });

    //creates a gradient effect from orange to pink
    // game.style.backgroundColor = "linear-gradient(90deg, orange, pink)";

    //Load tetris game (and audio, pause menu), from tetris.js
    loadTetris();
}


//Load breakout, make the canvas visible and hide the main content when the breakout button is clicked
function playBreakout(){
    game.style.display="block";
    game.style.width="72vh";
    game.style.height="90vh";
    game.style.backgroundColor = "rgb(250, 200, 152)";
    game.style.color = "black";
    mainContent.style.display="none";

    var animation = game.animate([
        { left: "-1000px" },
        { left: "50%" }
      ], {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards"
      });

    //Load breakout game (and audio, pause menu), from breakout.js
    loadBreakout();
}



//Add event listeners to main page's buttons to play games when clicked
snakeButton.addEventListener("click", playSnake);
tetrisButton.addEventListener("click", playTetris);
breakoutButton.addEventListener("click", playBreakout);


//Load the help popup for home page by default (from HelpPopupController.js)
loadHelpPopup("home");


// Sign up and Sign in Modal code
const signInModal = document.getElementById("signInModal");
const signUpModal = document.getElementById("signUpModal");
const closeButtons = document.getElementsByClassName("close");
const signInWithGoogleButton = document.getElementById("signInWithGoogleButton");
const signUpWithGoogleButton = document.getElementById("signUpWithGoogleButton");

// Add event listeners to the sign in and sign up buttons
signInWithGoogleButton.addEventListener("click", showSignInWithGoogle);
signUpWithGoogleButton.addEventListener("click", showSignInWithGoogle);
document.getElementById("signInButton").addEventListener("click", showSignInModal);
document.getElementById("signUpButton").addEventListener("click", showSignUpModal);

//Get the forms from the modals
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

//Add event listeners to the forms
signInForm.addEventListener("submit", signIn);
signUpForm.addEventListener("submit", signUp);


// Close modals
for (let i = 0; i < closeButtons.length; i++) {
  closeButtons[i].onclick = function() {
    signInModal.style.display = "none";
    signUpModal.style.display = "none";
  }
}

