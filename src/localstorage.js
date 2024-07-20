export const localStorage = {
  get: (key, callback) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError)
      } else {
        callback(result)
      }
    })
  },
  set: (configs, callback) => {
    chrome.storage.local.set(configs, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting data:', chrome.runtime.lastError)
      } else if (callback) {
        callback()
      }
    })
  },
  listen: (callback) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      console.log('change', changes, areaName)
    })
  },
}
