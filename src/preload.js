const { contextBridge, ipcRenderer } = require('electron');

let bridge = {
    updateMessage: (callback) => ipcRenderer.send('update-message', callback)
}

contextBridge.exposeInMainWorld('bridge',bridge);