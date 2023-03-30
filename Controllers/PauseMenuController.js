const pausemenu = document.getElementById("pause-menu");
const resume = document.getElementById("resume-button");
const exit = document.getElementById("exit-button");

const helpPopup = document.getElementById("help-popup");
const helpButton = document.getElementById("help-button");
const homeButton = document.getElementById("home-button");

var paused = false;
var loopFunction = null;


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

function resumeLoop(){
    //close pause menu
    pausemenu.style.display = "none";

    //close help popup
    helpButton.disabled = false;

    //resume gameplay
    paused = false;
    requestAnimationFrame(loopFunction);
}

function exitGame(){
    //Simulate click to close out previous game
    homeButton.click();
}


export function loadPauseMenu(loop){
    loopFunction = loop;

    //add event listener for escape key
    document.addEventListener('keydown', pauseMenu);

    //resume button closes pause menu
    resume.addEventListener("click", resumeLoop);

    //restart button restarts game
    exit.addEventListener("click", exitGame);
}

export function resetPauseMenu(){
    //remove event listener for escape key
    document.removeEventListener('keydown', pauseMenu);

    //close pause menu
    pausemenu.style.display = "none";
    paused = false;

    //make help button clickable
    helpButton.disabled = false;

    //remove event listeners for buttons
    resume.removeEventListener("click", resumeLoop);
    exit.removeEventListener("click", exitGame);
}

export function isPaused(){
    return paused;
}
