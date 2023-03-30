const playButton = document.getElementById("audio-play-button");
var audio;

export function loadAudio(sound){
    playButton.style.display="flex";
    audio = sound;
    playButton.addEventListener("click", changeAudio);    
}

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

export function stopAudio(audio){
    const playButton = document.getElementById("audio-play-button");
    audio.pause();
    audio.currentTime = 0;

    //Reset play button
    playButton.innerHTML = "&#x1f507;";
    playButton.removeEventListener("click", changeAudio);
    playButton.style.display="none";
}