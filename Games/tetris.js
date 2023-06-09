import { loadAudio, stopAudio } from "../Controllers/AudioController.js";
import { isPaused, loadPauseMenu, resetPauseMenu } from "../Controllers/PauseMenuController.js";
import { loadHelpPopup } from "../Controllers/HelpPopupController.js";
import { getCurrentUser, updateScore, getUsername, getUserScore } from "../firebase-functions.js";

var guestHighScore = 0;

// https://tetris.fandom.com/wiki/Tetris_Guideline

// get a random integer between the range of [min,max]
// @see https://stackoverflow.com/a/1527820/2124254

async function updateScoreAsync(userId, game, score) {
  await updateScore(userId, game, score);
}

export async function loadTetris(){
  const homeButton = document.getElementById("home-button");
  const mainContent = document.getElementById("main-content");
  
  //Make and then load the audio for tetris (from AudioController.js)
  const audio = new Audio("/triplex.github.io/Audio/tetris-sound.mp3");
  loadAudio(audio);

  //Load the pause menu and attach game's loop to it (to be paused) (from PauseMenuController.js)
  loadPauseMenu(tetrisLoop);

  //Load the help menu for tetris (from HelpPopupController.js)
  loadHelpPopup("tetris");

  //Display score and high score
  var score = 0;
  var highscore = 0;

  //Get the user from firebase
  var user = await getCurrentUser();

  var hasUser = user != null;
  var username = (user != null)? await getUsername(user.uid) : null;
  var updatedScore = false;

  if (user){
    //Get the user's high score from firebase
    let dbsScore = await getUserScore(user.uid, "tetris");
    highscore = (dbsScore == null) ? 0 : dbsScore;
  }
  else {
    highscore = guestHighScore;
  }

  const scoreboard = document.getElementById("score-board");
  scoreboard.style.display = "block";

  const highscoreboard = document.getElementById("highscore-board");
  highscoreboard.style.display = "block";

  document.getElementById("score-board").innerHTML = "Current Score: " + score; 
  document.getElementById("highscore-board").innerHTML = (hasUser)? username + "'s High Score: " + highscore : "Guest's High Score: " + highscore; 


  async function resetGameAfterSpacebar(e){
    if (e.code === "Space") {
      console.log("Resetting tetris.");
      gameOver = false;
      document.removeEventListener('keydown', resetGameAfterSpacebar); 
      await loadTetris();
    }
  }

  //When the home button is clicked, stop the game loop, clear the canvas, stop the audio, reset the pause menu, and return to the home page
  function returnHome(){
    document.removeEventListener('keydown', resetGameAfterSpacebar); 
    //Stop game loop, clear canvas
    cancelAnimationFrame(rAF);
    context.clearRect(0,0,canvas.width,canvas.height);

    //Stop audio (from AudioController.js)
    stopAudio(audio);

    //Reset pause menu (from PauseMenuController.js)
    resetPauseMenu();

    //Reset help popup (from HelpPopupController.js)
    loadHelpPopup("home");

    //Make score board dissapear
    scoreboard.style.display = "none"
    highscoreboard.style.display = "none"

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
  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
    
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // generate a new tetromino sequence
    // @see https://tetris.fandom.com/wiki/Random_Generator
    function generateSequence() {
      const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    
      while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
      }
    }
    
    // get the next tetromino in the sequence
    function getNextTetromino() {
      if (tetrominoSequence.length === 0) {
        generateSequence();
      }
    
      const name = tetrominoSequence.pop();
      const matrix = tetrominos[name];
    
      // I and O start centered, all others start in left-middle
      const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    
      // I starts on row 21 (-1), all others start on row 22 (-2)
      const row = name === 'I' ? -1 : -2;
    
      return {
        name: name,      // name of the piece (L, O, etc.)
        matrix: matrix,  // the current rotation matrix
        row: row,        // current row (starts offscreen)
        col: col         // current col
      };
    }
    
    // rotate an NxN matrix 90deg
    // @see https://codereview.stackexchange.com/a/186834
    function rotate(matrix) {
      const N = matrix.length - 1;
      const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
      );
    
      return result;
    }
    
    // check to see if the new matrix/row/col is valid
    function isValidMove(matrix, cellRow, cellCol) {
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] && (
              // outside the game bounds
              cellCol + col < 0 ||
              cellCol + col >= playfield[0].length ||
              cellRow + row >= playfield.length ||
              // collides with another piece
              playfield[cellRow + row][cellCol + col])
            ) {
            return false;
          }
        }
      }
    
      return true;
    }
    
    // place the tetromino on the playfield
    function placeTetromino() {
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
    
            // game over if piece has any part offscreen
            if (tetromino.row + row < 0) {
              //reset score
              if (score > highscore && !updatedScore) {
                //update highscore in firebase if user exists
                if (user) {
                  updateScoreAsync(user.uid, "tetris", score);
                  updatedScore = true;
                }
                else{
                  guestHighScore = score;
                }
                highscore = score;
                
                //update highscore in html
                document.getElementById("highscore-board").innerHTML = (hasUser)? username + "'s High Score: " + highscore : "Guest's High Score: " + highscore; 
              }
              score = 0;
              document.getElementById("score-board").innerHTML = "Current Score: " + score;

              return showGameOver();
            }
    
            playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
          }
        }
      }
    
      // check for line clears starting from the bottom and working our way up
      for (let row = playfield.length - 1; row >= 0; ) {
        if (playfield[row].every(cell => !!cell)) {
      
          // drop every row above this one
          for (let r = row; r >= 0; r--) {
            for (let c = 0; c < playfield[r].length; c++) {
              playfield[r][c] = playfield[r-1][c];
            }
          }
          //update score
          score += 1;
          if (score > highscore) {
            updatedScore = false;
          }
          document.getElementById("score-board").innerHTML = "Current Score: " + score;
        }
        else {
          row--;
        }
      }
    
      tetromino = getNextTetromino();
    }
    
    // show the game over screen
    function showGameOver() {
      cancelAnimationFrame(rAF);
      gameOver = true;
    
      context.fillStyle = 'black';
      context.globalAlpha = 0.75;
      context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    
      context.globalAlpha = 1;
      context.fillStyle = 'white';
      context.font = '36px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);

      //reset game (added in cause it seems like an important feature)
      context.fillStyle = 'black';
      context.globalAlpha = 0.75;
      context.fillRect(0, canvas.height / 1.50 - 30, canvas.width, 60);
    
      context.globalAlpha = 1;
      context.fillStyle = 'white';
      context.font = '36px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Press the spacebar to restart', canvas.width / 2, canvas.height / 1.50);
      
      document.addEventListener('keydown', resetGameAfterSpacebar);    
    }
    
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const blockWidth = Math.floor(canvas.width/10);
    const blockHeight = Math.floor(canvas.height/20);
    const tetrominoSequence = [];


    // keep track of what is in every cell of the game using a 2d array
    // tetris playfield is 10x20, with a few rows offscreen
    const playfield = [];
    
    // populate the empty state
    for (let row = -2; row < 20; row++) {
      playfield[row] = [];
    
      for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
      }
    }
    
    // how to draw each tetromino
    // @see https://tetris.fandom.com/wiki/SRS
    const tetrominos = {
      'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
      ],
      'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
      ],
      'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
      ],
      'O': [
        [1,1],
        [1,1],
      ],
      'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
      ],
      'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
      ],
      'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
      ]
    };
    
    // color of each tetromino
    const colors = {
      'I': 'salmon',
      'O': 'deeppink',
      'T': 'coral',
      'S': 'lightpink',
      'Z': 'violet',
      'J': 'purple',
      'L': 'pink'
    };
    
    let count = 0;
    let tetromino = getNextTetromino();
    let rAF = null;  // keep track of the animation frame so we can cancel it
    let gameOver = false;
    
    // game loop
    async function tetrisLoop() {
      if (isPaused()) return;

      rAF = requestAnimationFrame(tetrisLoop);
      context.clearRect(0,0,canvas.width,canvas.height);
      
      // draw the playfield
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (playfield[row][col]) {
            const name = playfield[row][col];
            context.fillStyle = colors[name];
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect(col * blockWidth, row * blockHeight, blockWidth-1, blockHeight-1);
          }
        }
      }
    
      // draw the active tetromino
      if (tetromino) {
    
        // tetromino falls every 35 frames
        if (++count > 35) {
          tetromino.row++;
          count = 0;
    
          // place piece if it runs into anything
          if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
            tetromino.row--;
            placeTetromino();
          }
        }
    
        context.fillStyle = colors[tetromino.name];
    
        for (let row = 0; row < tetromino.matrix.length; row++) {
          for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
    
              // drawing 1 px smaller than the grid creates a grid effect
              context.fillRect((tetromino.col + col) * blockWidth, (tetromino.row + row) * blockHeight, blockWidth-1, blockHeight-1);
            }
          }
        }
      }
    }
    
    // listen to keyboard events to move the active tetromino
    document.addEventListener('keydown', function(e) {
      if (gameOver) return;
    
      // left and right arrow keys (move)
      if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
          ? tetromino.col - 1
          : tetromino.col + 1;
    
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
          tetromino.col = col;
        }
      }
    
      // up arrow key (rotate)
      if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
          tetromino.matrix = matrix;
        }
      }
    
      // down arrow key (drop)
      if(e.which === 40) {
        const row = tetromino.row + 1;
    
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
          tetromino.row = row - 1;
    
          placeTetromino();
          return;
        }
    
        tetromino.row = row;
      }
    });
    
    // start the game
    rAF = requestAnimationFrame(tetrisLoop);
}
