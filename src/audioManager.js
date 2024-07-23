import { createOffscreenDocument, hasOffscreenDocument } from "./utils";

const path = "offscreen.html";

export const togglePlayState = async (selectedStation) => {
  try {
    let offscreenAvailable = await hasOffscreenDocument(path);

    if (!offscreenAvailable) {
      await createOffscreenDocumentIFNecessary();
      offscreenAvailable = await hasOffscreenDocument(path);
    }

    if (offscreenAvailable) {
      const isPlaying = backgroundMusic.innerText === "pause";
      chrome.runtime.sendMessage({
        type: "audioController",
        payload: {
          selectedStation: selectedStation,
          isPlaying: !isPlaying,
        },
      });
      backgroundMusic.innerText = isPlaying ? "play" : "pause";
      // localStorage.set({ sound: { state: !isPlaying } });
    }
  } catch (error) {
    console.error("Error handling background music:", error);
  }
};

const createOffscreenDocumentIFNecessary = async () => {
  try {
    await createOffscreenDocument(
      path,
      "AUDIO_PLAYBACK",
      "Background music playback"
    );
  } catch (error) {
    console.error("Error creating offscreen document:", error);
  }
};
