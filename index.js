const electron = require('electron');
console.log('ELECTRON_RUN_AS_NODE:', process.env.ELECTRON_RUN_AS_NODE);
const { app } = electron;

const { createWindow, autoUpdaterApp } = require('./src/app');

app.whenReady().then(() => {
    const mainWindow = createWindow();
    autoUpdaterApp(mainWindow);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
