const helpButton = document.getElementById("help-button");
const helpPopup = document.getElementById("help-popup");
const helpPopupText = document.getElementById("help-popup-text");
const closeButton = document.getElementById("close-help-button");
const homeButton = document.getElementById("home-button");

const loginPopup = document.getElementById("login-popup");
const signOutPopup = document.getElementById("signout-popup");

//When help button is clicked, display the help popup
helpButton.addEventListener("click", () => {
    helpPopup.style.display = "flex";
    //Hide the login and sign out popups if they are open
    loginPopup.style.display = "none";
    signOutPopup.style.display = "none";
});

//When close button is clicked, hide the help popup
closeButton.addEventListener("click", () => {
    helpPopup.style.display = "none";
});

//When home button is clicked, hide the current help popup and load the home help popup (for future use)
homeButton.addEventListener("click", () => {
    helpPopup.style.display = "none";
    loadHelpPopup("home");
});


//Load the help popup for the game that is currently being played, called by GUIController.js
export function loadHelpPopup(screenName){
    helpPopup.style.display = "none";
    helpPopupText.innerHTML = "";

    //Create elements for the help popup
    const h2 = document.createElement('h2');
    h2.classList = "reverse-gradient-text";
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');

    //Add text to the help popup based on the game that is currently being played

    if(screenName == "home"){
        h2.textContent = 'Welcome to Triplex';
        p1.textContent = 'In order to start click on the game you would like to play. To pause hit escape';
        p2.textContent = 'Login with your Google Account or Create a New Account!';
        p3.innerHTML = '<b>Enjoy Triplexing!</b>';
    }

    if(screenName == "snake"){
        h2.textContent = 'Snake';
        p1.textContent = 'Use the arrow keys to move the snake';
        p2.textContent = 'Eat the food to grow';
        p3.textContent = 'Avoid hitting yourself! To pause hit escape';
    }

    if(screenName == "tetris"){
        h2.textContent = 'Tetris';
        p1.textContent = 'Use the arrow keys to move or rotate the tetromino';
        p2.textContent = 'Hold the down arrow key to speed up the tetromino';
        p3.textContent = 'Fill up a row to clear it! To pause hit escape';
    }

    if(screenName == "breakout"){
        h2.textContent = 'Breakout';
        p1.textContent = 'Use the left and right arrow keys to move the paddle';
        p2.textContent = 'Bounce the ball off the paddle to break the bricks';
        p3.textContent = 'Break all the bricks to win! To pause hit escape';
    }

    //Append the elements to the help popup
    helpPopupText.appendChild(h2);
    helpPopupText.appendChild(p1);
    helpPopupText.appendChild(p2);
    helpPopupText.appendChild(p3);
}
