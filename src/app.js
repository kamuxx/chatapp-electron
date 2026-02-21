const { BrowserWindow, Menu, app, ipcMain } = require('electron');
const {contacts, chats} = require('./chats');
const { autoUpdater, AppUpdater } = require('electron-updater');

const path = require('path');
const srcPath = path.join(__dirname);
const pagesPath = path.join(__dirname, 'pages');
const componentsPath = path.join(__dirname, 'components');

function createWindow() {
    let mainWindow = new BrowserWindow({
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
    }
    ]);
    mainWindow.setMenu(menu);    
    mainWindow.webContents.on('did-finish-load',() => {
        //mainWindow.webContents.send('chats',chats);
        mainWindow.webContents.send('contacts',contacts);
    })
    
    ipcMain.on('contact-selected',(event, arg)=>{        
        const contact = chats.find(contact => contact.nick === arg);        
        const {messages} = contact;        
        mainWindow.webContents.send('user-messages',messages);
    });

    ipcMain.on('check-for-updates',()=> {
        mainWindow.webContents.send('update-available',{message:"Update available"});
    })

    ipcMain.on('start-update-download',()=> {
        // Iniciar descarga
        autoUpdater.downloadUpdate();
        mainWindow.webContents.send('update-downloading',{message:"Update downloading"});
    });

    ipcMain.on('install-update',()=> {
        // Instalar update

        mainWindow.webContents.send('update-ready',{message:"Update ready"});

        autoUpdater.quitAndInstall();
    });

    return mainWindow;
}

function autoUpdaterApp(mainWindow){
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-available',() => {
        console.log('Update available');
        mainWindow.webContents.send('update-available');
    })


    autoUpdater.on('update-downloaded',() => {
        console.log('Update downloaded');
        mainWindow.webContents.send('update-ready');
    })

    autoUpdater.on('error',(error) => {
        console.log('Error updating',error);
    })
}

module.exports = { createWindow, autoUpdaterApp };