import {loadBreakout} from "../Games/breakout.js";
import {loadSnake} from "../Games/snake.js";
import {loadTetris} from "../Games/tetris.js";
import {loadHelpPopup} from "./HelpPopupController.js";

const game = document.getElementById("game");
const mainContent = document.getElementById("main-content");

const snakeButton = document.getElementById("snake-button");
const tetrisButton = document.getElementById("tetris-button");
const breakoutButton = document.getElementById("breakout-button");

//Add event listeners to main page's buttons to play games when clicked
snakeButton.addEventListener("click", playSnake);
tetrisButton.addEventListener("click", playTetris);
breakoutButton.addEventListener("click", playBreakout);


//Load the help popup for home page by default (from HelpPopupController.js)
loadHelpPopup("home");


//Load snake, make the canvas visible and hide the main content when the snake button is clicked
function playSnake(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="90vh";
    game.style.backgroundColor = "rgb(174,198,207)";
    game.style.color = "black";

    mainContent.style.display="none";
    
    //Load snake game (and audio, pause menu), from snake.js
    loadSnake();
}


//Load tetris, make the canvas visible and hide the main content when the tetris button is clicked
function playTetris(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="45vh";
    game.style.backgroundColor = "rgb(248, 200, 220)";
    game.style.color = "black";

    mainContent.style.display="none";    

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

    //Load breakout game (and audio, pause menu), from breakout.js
    loadBreakout();
}
