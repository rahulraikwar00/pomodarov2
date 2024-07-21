export const setupStorageConfigUpdated = () => {
  const timer = {
    duration: 1500,
    remainingTime: 1500,
    mode: "pomoji",
    isActive: false,
  };

  const animation = {
    isActive: false,
    position: { x: 0, y: 0 },
  };

  const sound = {
    isPlaying: false,
    filename: "",
  };

  return { timer, animation, sound };
};
