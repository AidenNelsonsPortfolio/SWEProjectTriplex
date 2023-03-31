const playButton = document.getElementById("audio-play-button");
var audio;

// Make play button visible and add event listener to it when game is loaded, called by each game
export function loadAudio(sound){
    playButton.style.display="flex";
    audio = sound;
    playButton.addEventListener("click", changeAudio);    
}

// Change play button to pause button and vice versa when clicked
function changeAudio(){
    if (audio.paused) {
      audio.loop = true;
      audio.play();
      playButton.innerHTML = "&#x1f50a;";
    } else {
      audio.pause();
      playButton.innerHTML = "&#x1f507;";
    }
  }

// Stop audio and reset play button when game is over, called by each game
export function stopAudio(audio){
    const playButton = document.getElementById("audio-play-button");
    audio.pause();
    audio.currentTime = 0;

    //Reset play button
    playButton.innerHTML = "&#x1f507;";
    playButton.removeEventListener("click", changeAudio);
    playButton.style.display="none";
}