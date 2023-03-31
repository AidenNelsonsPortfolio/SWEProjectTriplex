const pausemenu = document.getElementById("pause-menu");
const resume = document.getElementById("resume-button");
const exit = document.getElementById("exit-button");

const helpPopup = document.getElementById("help-popup");
const helpButton = document.getElementById("help-button");
const homeButton = document.getElementById("home-button");

var paused = false;

//Will be set to the loop function of the game
var loopFunction = null;


//Pause game when escape key is pressed

function pauseMenu(e){
    // escape key
    if (e.which === 27) {
        //open pause menu
        pausemenu.style.display = "block";

        //close help popup
        helpPopup.style.display = "none";

        //disable help button
        helpButton.disabled = true;

        //stop gameplay
        paused = true;
    }
}

//Resume game when resume button is clicked
function resumeLoop(){
    //close pause menu
    pausemenu.style.display = "none";

    //close help popup
    helpButton.disabled = false;

    //resume gameplay
    paused = false;
    requestAnimationFrame(loopFunction);
}

//Exit game when exit button is clicked
function exitGame(){
    //Simulate click to close out previous game
    homeButton.click();
}

//Load pause menu and add event listeners to buttons, called by each game
export function loadPauseMenu(loop){
    loopFunction = loop;

    //add event listener for escape key
    document.addEventListener('keydown', pauseMenu);

    //resume button closes pause menu
    resume.addEventListener("click", resumeLoop);

    //restart button restarts game
    exit.addEventListener("click", exitGame);
}

//Remove event listeners and close pause menu, called by each game when game is over or home button is clicked
export function resetPauseMenu(){
    //remove event listener for escape key
    document.removeEventListener('keydown', pauseMenu);

    //close/hide pause menu
    pausemenu.style.display = "none";
    paused = false;

    //make help button clickable
    helpButton.disabled = false;

    //remove event listeners for buttons
    resume.removeEventListener("click", resumeLoop);
    exit.removeEventListener("click", exitGame);
}

//Used by game loop to check if game is paused (to stop game loop)
export function isPaused(){
    return paused;
}
