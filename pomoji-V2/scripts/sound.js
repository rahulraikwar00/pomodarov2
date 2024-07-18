// sound.

class SoundManager {
  constructor() {
    this.sound = new Audio();
    this.sound.src = chrome.runtime.getURL("sound/lofiloop.mp3");
    this.sound.loop = true;
  }
  play() {
    this.sound.play();
  }

  pause() {
    this.sound.pause();
  }

  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }

  isPlaying() {
    return this.sound.currentTime > 0 && !this.sound.paused;
  }
}

function playSound(sound) {
  sound.play();
}
function loopLofiSound(sound) {
  sound.play();
}
function pauseLofiSound(sound) {
  sound.pause();
}
