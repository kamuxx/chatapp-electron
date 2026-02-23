const { BrowserWindow, Menu, app, ipcMain } = require('electron');
const { contacts, chats } = require('./chats');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const path = require('path');
const srcPath = path.join(__dirname);
const pagesPath = path.join(__dirname, 'pages');
const componentsPath = path.join(__dirname, 'components');
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    //mainWindow.loadFile(path.join(componentsPath,'layout.html'));
    //mainWindow.loadFile(path.join(pagesPath,'auth/register.html'));
    mainWindow.loadFile(path.join(pagesPath, 'chat.html'));

    // Opcional: Si no quieres que se abran solas al iniciar
    mainWindow.webContents.openDevTools(); // Disabled to avoid Autofill.setAddresses console error

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Console',
                    click: () => {
                        // CORRECTO: Acceder a través de webContents
                        mainWindow.webContents.openDevTools();
                    }
                },
                {
                    label: 'Exit',
                    click: () => {
                        app.quit();
                    }
                },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        mainWindow.webContents.send('about');
                    }
                },
                {
                    label: 'Check for updates',
                    click: () => {
                        mainWindow.webContents.send('check-for-updates');
                    }
                }
            ]
        }
    ]);
    mainWindow.setMenu(menu);
    mainWindow.webContents.on('did-finish-load', () => {
        //mainWindow.webContents.send('chats',chats);
        mainWindow.webContents.send('contacts', contacts);
    })

    ipcMain.on('contact-selected', (event, arg) => {
        const contact = chats.find(contact => contact.nick === arg);
        const { messages } = contact;
        mainWindow.webContents.send('user-messages', messages);
    });

    ipcMain.on('check-for-updates', () => {
        autoUpdater.checkForUpdates();
    })

    ipcMain.on('start-update-download', () => {
        // Iniciar descarga
        autoUpdater.downloadUpdate();
        mainWindow.webContents.send('update-downloading', { message: "Update downloading" });
    });

    ipcMain.on('install-update', () => {
        // Instalar update

        mainWindow.webContents.send('update-ready', { message: "Update ready" });

        autoUpdater.quitAndInstall();
    });

    return mainWindow;
}

function autoUpdaterApp(mainWindow) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        sendStatusToWindow('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendStatusToWindow(log_message);
    })
    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('Update downloaded');
    });
}


function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('message', text);
}

module.exports = { createWindow, autoUpdaterApp };