export const localStorage = {
  async get(key) {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  },
  async set(configs) {
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.set(configs, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Error setting data:", error);
      throw error;
    }
  },
};

export const setupStorageConfig = () => {
  const timer = {
    duration: 1500,
    time: 1500,
    mode: "pomoji",
    stateType: "stopped",
    state: false,
  };

  const animation = {
    state: false,
    position: { x: 0, y: 0 },
  };

  const sound = {
    state: false,
    filename: "",
  };

  return { timer, animation, sound };
};
