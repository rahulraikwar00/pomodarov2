console.log("animation.js is loaded");

class Animation {
  constructor(
    canvas,
    canvasforAnmiation,
    spritesheet,
    finishImage,
    finishCallback
  ) {
    this.canvas = canvas;
    this.canvasforAnmiation = canvasforAnmiation;
    this.ctx = canvas.getContext("2d");
    this.canvasforAnmiationctx = canvasforAnmiation.getContext("2d");
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
    const scaleFactor = 1;
    this.canvasforAnmiationctx.clearRect(
      0,
      0,
      this.canvasforAnmiation.width,
      this.canvasforAnmiation.height
    );
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);

    const position = Math.round(this.gameFrame / this.staggerframes) % 12;
    this.frameX = this.spritewidth * position;
    const positionX = this.spritewidth + this.distancetogoal;

    // move the canvas to the right
    this.canvasforAnmiation.style.left = `${positionX - this.spritewidth}px`;
    this.drawFinishImage();
    this.drawProgressBar(positionX);

    this.canvasforAnmiationctx.drawImage(
      this.spritesheet,
      this.frameX,
      this.frameY * this.spriteheight,
      this.spritewidth * scaleFactor,
      this.spriteheight * scaleFactor,
      0,
      0,
      this.canvasforAnmiation.width,
      this.canvasforAnmiation.height
    );

    if (positionX >= this.canvas.width - this.spritewidth - 45) {
      this.distancetogoal = 0;
      if (!this.hasReachedFinish) {
        this.hasReachedFinish = true;
        this.finishCallback;
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
