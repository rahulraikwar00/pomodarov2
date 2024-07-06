console.log("timer.js is loaded");

class Timer {
  constructor(targetTime, updateCallback, finishCallback) {
    this.targetTime = targetTime; // Original target time for the main countdown
    this.updateCallback = updateCallback;
    this.finishCallback = finishCallback;
    this.timerInterval = null;
    this.remainingTime = targetTime; // Initialize remainingTime to the original target time
    this.breakTime = 5 * 60; // 5 minutes break time in seconds
    this.isOnBreak = false;
  }

  start() {
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
  }

  reset() {
    this.stop();
    this.remainingTime = this.targetTime; // Reset remainingTime to the original target time
    this.updateDisplay();
    this.isOnBreak = false;
  }

  resume() {
    this.start();
  }

  startBreak() {
    this.isOnBreak = true;
    this.remainingTime = this.breakTime; // Set remainingTime to break time
    this.stop();
    this.updateDisplay();
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  update() {
    this.remainingTime--; // Decrement remainingTime
    if (this.remainingTime < 0) {
      this.stop();
      if (this.isOnBreak) {
        this.isOnBreak = false;
        this.remainingTime = this.targetTime; // Reset to original target time after break
        this.resume();
      } else {
        this.finishCallback();
      }
      return;
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.updateCallback(minutes, seconds);
  }

  hasRemainingTime() {
    return this.remainingTime > 0;
  }
}
