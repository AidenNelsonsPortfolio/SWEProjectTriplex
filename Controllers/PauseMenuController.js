const pauseMenu = document.getElementById("pause-menu");
const resume = document.getElementById("resume-button");
const exit = document.getElementById("exit-button");

const helpPopup = document.getElementById("help-popup");
const helpButton = document.getElementById("help-button");
const homeButton = document.getElementById("home-button");
const EE = document.getElementById("egg-button");
const EEPopup = document.getElementById("ee-popup");
const EEClose = document.getElementById("close-ee-button");

var paused = false;

//Will be set to the loop function of the game
var loopFunction = null;


//Pause game when escape key is pressed

function openPauseMenu(e){
    // escape key
    if (e.which === 27) {
        //open pause menu
        pauseMenu.style.display = "block";

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
    pauseMenu.style.display = "none";

    //close help popup
    helpButton.disabled = false;

    //close EE popup
    EEPopup.style.display = "none";

    //resume gameplay
    paused = false;
    requestAnimationFrame(loopFunction);
}

//Exit game when exit button is clicked
function exitGame(){
    //Simulate click to close out previous game
    homeButton.click();
}

function openEasterEgg(){
    //open EE popup
    EEPopup.style.display = "flex";
}

function closeEasterEgg(){
    //close EE popup
    EEPopup.style.display = "none";
}

//Load pause menu and add event listeners to buttons, called by each game
export function loadPauseMenu(loop){
    loopFunction = loop;

    //add event listener for escape key
    document.addEventListener('keydown', openPauseMenu);

    //resume button closes pause menu
    resume.addEventListener("click", resumeLoop);

    //restart button restarts game
    exit.addEventListener("click", exitGame);

    //add event listener for Easter Egg button
    EE.addEventListener("click", openEasterEgg);

    //add event listener to close EE button
    EEClose.addEventListener("click", closeEasterEgg);
}

//Remove event listeners and close pause menu, called by each game when game is over or home button is clicked
export function resetPauseMenu(){
    //remove event listener for escape key
    document.removeEventListener('keydown', openPauseMenu);

    //close/hide pause menu
    pauseMenu.style.display = "none";
    paused = false;

    //make help button clickable
    helpButton.disabled = false;

    //remove event listeners for buttons
    resume.removeEventListener("click", resumeLoop);
    exit.removeEventListener("click", exitGame);

    //close EE popup
    EEPopup.style.display = "none";

    //remove event listeners for Easter Egg button
    EE.removeEventListener("click", openEasterEgg);

    //remove event listeners to close EE button
    EEClose.removeEventListener("click", closeEasterEgg);

}

//Used by game loop to check if game is paused (to stop game loop)
export function isPaused(){
    return paused;
}