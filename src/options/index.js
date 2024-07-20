import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.style.setProperty(
    "--background",
    `url(${chrome.runtime.getURL("img/girl.gif")})`
  );

  // TODO

  //set a slider to set the timer and other function
});
