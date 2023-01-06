const storge = window.localStorage

chrome.runtime.onConnect.addListener((port) => {
  if (port.name == "pop-connect") {
    port.onMessage.addListener(function (message) {
      const { source = "", data = "" } = message

      if (source == "get-storage") {
        port.postMessage(storge)
      }

      if (source == "save-storage") {
        if (!data?.length) {
          port.postMessage(false)
          return
        }
        const oData = JSON.parse(data)
        Object.keys(oData).forEach((key) => {
          window.localStorage.setItem(key, oData[key])
        })
        port.postMessage(true)
      }

      if (source == "backup") {
        port.postMessage(storge)
      }
    })
  }
})
