import {loadBreakout} from "../Games/breakout.js";
import {loadSnake} from "../Games/snake.js";
import {loadTetris} from "../Games/tetris.js";
import {loadHelpPopup} from "./HelpPopupController.js";

const game = document.getElementById("game");
const mainContent = document.getElementById("main-content");

const snakeButton = document.getElementById("snake-button");
const tetrisButton = document.getElementById("tetris-button");
const breakoutButton = document.getElementById("breakout-button");

snakeButton.addEventListener("click", playSnake);
tetrisButton.addEventListener("click", playTetris);
breakoutButton.addEventListener("click", playBreakout);

//Load the help popup
loadHelpPopup("home");

function playSnake(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="90vh";

    mainContent.style.display="none";
    loadHelpPopup("snake");
    loadSnake();
}

function playTetris(){
    game.style.display="block";
    game.style.height="90vh";
    game.style.width="45vh";

    mainContent.style.display="none";
    loadHelpPopup("tetris");
    loadTetris();
}

function playBreakout(){
    game.style.display="block";
    game.style.width="72vh";
    game.style.height="90vh";

    mainContent.style.display="none";
    loadHelpPopup("breakout");
    loadBreakout();
}