console.log("content-script.js is loaded");
// import confetti from "canvas-confetti";

// const canvas = document.createElement("canvas");
// canvas.id = "canvas2";
// canvas.style.position = "fixed";
// canvas.style.bottom = "0";
// canvas.style.left = "0";
// canvas.style.width = "100vw";
// canvas.style.height = "50px";
// canvas.style.backgroundColor = "transparent";
// // canvas.style.opacity = "0.4";
// canvas.style.zIndex = "99";
// canvas.style.pointerEvents = "none";

// const canvasforAnmiation = document.createElement("canvas");
// canvasforAnmiation.id = "canvasforAnmiation";
// canvasforAnmiation.style.position = "fixed";
// canvasforAnmiation.style.bottom = "0";
// canvasforAnmiation.style.left = "0";
// canvasforAnmiation.style.width = "50px";
// canvasforAnmiation.style.height = "50px";
// canvasforAnmiation.style.backgroundColor = "transparent";
// // canvasforAnmiation.style.opacity = "";/home/mthead/coding/pesonal-project/aniamtion/scripts
// canvasforAnmiation.style.zIndex = "999";
// canvasforAnmiation.style.pointerEvents = "none";

// document.body.appendChild(canvas);
// document.body.appendChild(canvasforAnmiation);
// // Adjust the canvas dimensions to match the CSS dimensions
// const vw = Math.max(
//   document.documentElement.clientWidth || 0,
//   window.innerWidth || 0
// );
// const vh = Math.max(
//   document.documentElement.clientHeight || 0,
//   window.innerHeight || 0
// );

// canvas.width = vw; // Set the canvas width to match viewport width
// canvas.height = vh * 0.08;

// console.log("cavas", canvas.width, canvas.height);

// const canvasctx = canvas.getContext("2d");
// const canvasforAnmiationCtx = canvasforAnmiation.getContext("2d");
// canvasctx.imageSmoothingEnabled = false;

// const spritesheet = new Image();
// spritesheet.src = chrome.runtime.getURL("images/walkpng.png");

// const finishImage = new Image();
// finishImage.src = chrome.runtime.getURL("images/finish.png");

// const finishSound = new Audio(
//   chrome.runtime.getURL("sound/celebratesound.mp3")
// );
// const lofiloop = new Audio(chrome.runtime.getURL("sound/lofiloop.mp3"));

// const targetTime = 25 * 60;
// chrome.storage.local
//   .get("storageVariables")
//   .then((result) => {
//     const storageVariables = result.storageVariables || {};
//     const targetTime = storageVariables.timer?.targetTime;

//     if (targetTime) {
//       console.log("targetTime", targetTime);
//     }
//   })
//   .catch((error) => {
//     console.error("Error retrieving storage:", error);
//   });

// const animation = new Animation(
//   canvas,
//   canvasforAnmiation,
//   spritesheet,
//   finishImage,
//   targetTime,
//   finishAnimation
// );

// Promise.all([
//   new Promise((resolve, reject) => {
//     spritesheet.onload = resolve;
//     spritesheet.onerror = reject;
//   }),
//   new Promise((resolve, reject) => {
//     finishImage.onload = resolve;
//     finishImage.onerror = reject;
//   }),
//   new Promise((resolve, reject) => {
//     finishSound.onload = resolve;
//     finishSound.onerror = reject;
//   }),
//   new Promise((resolve, reject) => {
//     lofiloop.onload = resolve;
//     lofiloop.onerror = reject;
//   }),
// ])
//   .then(() => {
//     console.log("All resources loaded successfully");
//   })
//   .catch((error) => {
//     console.error("Failed to load resources:", error);
//   });

// function finishAnimation() {
//   console.log("Animation finished! Sound has stopped playing");
//   finishSound.play();
//   toggelSFX();
//   animation.reset();
// }

// function setupAnimation() {
//   console.log("taget time has been set to", targetTime);
//   animation.setTargetTime(targetTime * 70);
//   animation.stop();
// }

// function startAnimation() {
//   animation.start();
// }

// function stopAnimation() {
//   animation.reset();
// }

// function resetAnimation() {
//   animation.reset();
// }

// function loopLofiSound(sound) {
//   sound.loop = true;
//   // sound.play();
// }

// function pauseLofiSound(sound) {
//   sound.pause();
// }
// function toggelSFX() {
//   if (lofiloop.paused) {
//     loopLofiSound(lofiloop);
//   } else {
//     pauseLofiSound(lofiloop);
//   }
// }

// setInterval(() => {
//   chrome.storage.local.get("timer", (result) => {
//     if (result.timer === 0) {
//       var end = Date.now() + 2 * 1000;

//       var colors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

//       (function frame() {
//         confetti({
//           particleCount: 5,
//           angle: 60,
//           spread: 55,
//           origin: { x: 0 },
//           colors: colors,
//         });
//         confetti({
//           particleCount: 5,
//           angle: 120,
//           spread: 55,
//           origin: { x: 1 },
//           colors: colors,
//         });
//         if (Date.now() < end) {
//           requestAnimationFrame(frame);
//         }
//       })();
//     }
//   });
// }, 1000);
