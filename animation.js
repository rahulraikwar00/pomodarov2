console.log("animation.js is loaded");

class Animation {
  constructor(canvas, ctx, spritesheet, finishImage, finishCallback) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.spritesheet = spritesheet;
    this.finishImage = finishImage;
    this.finishCallback = finishCallback;

    this.spritewidth = 40.7;
    this.spriteheight = 40;
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrame = 0;
    this.staggerframes = 7;
    this.distancetogoal = 0;
    this.hasReachedFinish = false;
    this.isAnimating = false;

    this.targetTime = 0; // 25 minutes in seconds
    this.speed = 0;
  }

  setTargetTime(targetTime) {
    this.targetTime = targetTime;
    this.speed = this.canvas.width / this.targetTime;
    console.log("Updated targetTime:", this.targetTime);
    console.log("Updated speed:", this.speed);
  }

  start() {
    this.isAnimating = true;
    this.animate();
  }

  stop() {
    this.isAnimating = false;
  }

  reset() {
    this.stop();
    this.distancetogoal = 0;
    this.gameFrame = 0;
    this.hasReachedFinish = false;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const position = Math.round(this.gameFrame / this.staggerframes) % 12;
    this.frameX = this.spritewidth * position;
    const positionX = this.spritewidth + this.distancetogoal;

    const centerY = this.canvas.height;

    this.drawFinishImage();
    this.drawProgressBar(positionX);

    this.ctx.drawImage(
      this.spritesheet,
      this.frameX,
      this.frameY * this.spriteheight,
      this.spritewidth,
      this.spriteheight,
      positionX - 40,
      centerY - 50,
      50,
      50
    );

    if (positionX >= this.canvas.width - this.spritewidth - 45) {
      this.distancetogoal = 0;
      if (!this.hasReachedFinish) {
        this.hasReachedFinish = true;
        return;
      }
    } else {
      //   console.log(this.canvas.width - this.spritewidth - 45, positionX);
      this.hasReachedFinish = false;
      this.gameFrame++;
      this.distancetogoal += this.speed;
    }

    if (this.isAnimating) {
      requestAnimationFrame(() => this.animate());
    }
  }

  drawFinishImage() {
    const finishImageX = this.canvas.width - this.spritewidth - 20;
    const finishImageY = this.canvas.height;

    this.ctx.drawImage(
      this.finishImage,
      finishImageX - 50,
      finishImageY - 90,
      100,
      100
    );
  }

  drawProgressBar(positionX) {
    const progressBarHeight = 5;
    const progressBarY = this.canvas.height - progressBarHeight;

    this.ctx.beginPath();
    this.ctx.moveTo(0, progressBarY);
    this.ctx.lineTo(positionX, progressBarY);
    this.ctx.strokeStyle = "#00796b";
    this.ctx.lineWidth = progressBarHeight;
    this.ctx.stroke();
  }
}
