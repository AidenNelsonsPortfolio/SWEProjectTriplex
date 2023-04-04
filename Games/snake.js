import { loadAudio, stopAudio } from "../Controllers/AudioController.js";
import { isPaused, loadPauseMenu, resetPauseMenu } from "../Controllers/PauseMenuController.js";
import { loadHelpPopup } from "../Controllers/HelpPopupController.js";

export function loadSnake(){
  var canvas = document.getElementById('game');
  var context = canvas.getContext('2d');
  const homeButton = document.getElementById("home-button");
  const mainContent = document.getElementById("main-content");


  //Make and then load the audio for snake (from AudioController.js)
  const audio = new Audio("/triplex.github.io/Audio/snake-sound.mp3");
  loadAudio(audio);


  //Load the pause menu and attach game's loop to it (to be paused) (from PauseMenuController.js)
  loadPauseMenu(loop);

  //Load the help popup for snake (from HelpPopupController.js)
  loadHelpPopup("snake");

  //When the home button is clicked, stop the game loop, clear the canvas, stop the audio, reset the pause menu, and return to the home page
  function returnHome(){
    //Stop game loop, clear canvas
    cancelAnimationFrame(id);
    context.clearRect(0,0,canvas.width,canvas.height);

    //Stop audio (from AudioController.js)
    stopAudio(audio);

    //Reset pause menu (from PauseMenuController.js)
    resetPauseMenu();

    //Reset help popup (from HelpPopupController.js)
    loadHelpPopup("home");

    //Make home display visible, canvas invisible
    mainContent.style.display="flex";
    canvas.style.display="none";

    //Prevent multiple event listeners from being added
    homeButton.removeEventListener("click", returnHome);
  }

  //When the home button is clicked, return to the home page
  homeButton.addEventListener("click", returnHome);



  /////////////////////////////////////////////////////////////////
  //GAME CODE STARTS HERE /////////////////////////////////////////


  // Make each grid square 1/25th of the canvas width
  var grid = Math.floor(canvas.width/25);
  var count = 0;

  var snake = {
    x: grid*10,
    y: grid*10,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
  };
  var apple = {
    x: grid*15,
    y: grid*15
  };

  // get random whole numbers in a specific range
  // @see https://stackoverflow.com/a/1527820/2124254
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // game loop
  function loop() {
    if(isPaused()) return;

    id = requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 4) {
      return;
    }

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
      snake.y = canvas.height;
    }
    else if (snake.y >= canvas.height) {
      snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({x: snake.x, y: snake.y});

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    // draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {

      // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
      context.fillRect(cell.x, cell.y, grid-1, grid-1);

      // snake ate apple
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;

        // canvas is 400x400 which is 25x25 grids
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }

      // check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.cells.length; i++) {

        // snake occupies same space as a body part. reset game
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          snake.x = grid*10;
          snake.y = grid*10;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;

          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
      }
    });
  }

  // listen to keyboard events to move the snake
  document.addEventListener('keydown', function(e) {
    // prevent snake from backtracking on itself by checking that it's
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  });

  // start the game
  let id = requestAnimationFrame(loop);
}