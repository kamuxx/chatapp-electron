const { app } = require('electron');
const { createWindow } = require('./src/app');


app.whenReady().then(createWindow);
