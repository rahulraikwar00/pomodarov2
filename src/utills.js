export async function createOffscreenDocument(path, reason, justification) {
  const offscreenDocument = await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL(path),
    reasons: [`${reason}`],
    justification: `${justification}`,
  })
  return offscreenDocument
}

export async function hasOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path)
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl],
  })
  return existingContexts.length > 0
}

export function toggleSoundtext() {
  const backgroundMusic = document.getElementById('backgroundMusic')
  backgroundMusic.innerText = backgroundMusic.innerText == 'play' ? 'pause' : 'play'
}
