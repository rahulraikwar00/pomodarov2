export const setupStorageConfig = () => ({
  timer: {
    duration: 1500,
    time: 1500,
    mode: 'pomoji',
    state: false,
  },
  animation: {
    state: false,
    position: { x: 0, y: 0 },
  },
  sound: {
    state: false,
    filename: '',
  },
})

export const setupStorageConfigUpdated = () => ({
  timer: {
    duration: 1500, // Default duration of the timer in seconds (25 minutes)
    remainingTime: 1500, // Remaining time in seconds
    mode: 'pomoji', // Mode of the timer ('pomoji' for work, 'break' for rest)
    isActive: false, // Whether the timer is currently active
  },
  animation: {
    isActive: false, // Whether the animation is currently active
    position: { x: 0, y: 0 }, // Position of the animation on the screen
  },
  sound: {
    isPlaying: false, // Whether the sound is currently playing
    filename: '', // Filename of the sound to be played
  },
})
