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
