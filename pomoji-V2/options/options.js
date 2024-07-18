const timeInput = document.getElementById("timeInput");
const setTime = document.getElementById("setTime");

setTime.addEventListener("click", () => {
  const value = parseInt(timeInput.value); // Parse input to integer
  if (isNaN(value) || value < 1) {
    alert("Please enter a valid focus time (minimum 1 minute)");
    return; // Exit the function if input is invalid
  }
  chrome.storage.local.set({ timer: value, isRunning: false }, () => {
    alert(`Focus time set to ${value} minutes!`);
    chrome.storage.local.get("timer", (result) => {
      console.log("data after settin from options", result);
    });
  });
});

// change the value of the span on caneg the of the input form slider
const timeValue = document.getElementById("timeValue");

timeInput.addEventListener("input", () => {
  timeValue.innerText = timeInput.value;
});
