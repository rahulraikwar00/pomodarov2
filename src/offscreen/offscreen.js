const audio = document.createElement('audio')
audio.src = chrome.runtime.getURL('sound/lofiloop.mp3')
audio.loop = true

document.body.appendChild(audio)

chrome.runtime.onMessage.addListener((msg) => {
  console.log('message in offscreen:', msg)
  switch (msg) {
    case 'play':
      audio.play()
      break
    case 'pause':
      audio.pause()
      break
  }
})
