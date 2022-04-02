
const { ipcMain, globalShortcut, Menu, BrowserWindow, dialog, app, shell } = require('electron');
const { menubar } = require('menubar');

const packageJson = require('./package.json');

const {settingsStore} = require('./src/utils.js');
const path = require('path');

const { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const isDebug = process.env.DEBUG == "true";

const homedir = require('os').homedir();

let windowHeight = settingsStore.get('windowHeight');

const windowSettings = {
  width: 600,
  height: parseInt(windowHeight),
  ...(!isDebug ? {
    transparent: true,
    frame: false,
    resizable: false,
    minimizable: false,
    closable: false,
    titleBarStyle: 'customButtonsOnHover',
  } : {}),
  webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
  }
}

if (isDebug) {
  app.whenReady().then(async () => {
    await installExtension(
      [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
        loadExtensionOptions: { allowFileAccess: true }
    })
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));

    let win = new BrowserWindow(windowSettings);
    win.loadFile(`${__dirname}/dist/index.html`)
  })
} else {
  let mb = menubar({
    dir: `${__dirname}/dist`,
    icon: `${__dirname}/IconTemplate.png`,
    browserWindow: windowSettings,
  });
  
  mb.on('ready', () => {

    // globalShortcut.register('CommandOrControl+I', () => {
    //   mb.showWindow()
    // })
    // setGlobalHotkey()
    // settings.onDidChange('globalShowHotkey', setGlobalHotkey())
  
    // sent from the frontend on escape key press
    ipcMain.on('hide-window', () => mb.hideWindow());
  })
  
  mb.on('show', () => {
    mb.window.webContents.send('menubar-show');
  })
  
  mb.on('hide', () => {
    mb.window.webContents.send('menubar-hide');
  });
  
  
  // mb.on('will-quit', () => {
  //   // Unregister all shortcuts.
  //   // globalShortcut.unregisterAll()
  // })

  //right click menu for Tray
  mb.on('after-create-window', function() {
    const contextMenu = Menu.buildFromTemplate ([
      { label: 'About Pulls', click: showAboutDialog },
      { 
        label: 'Preferences', 
        click: () => shell.openPath(path.join(homedir, '.pulls-config.yaml')), 
      },
      // { label: 'Clear App Data', click: clearAppData },
      // { label: 'Display App Data', click: displayAppData },
      { label: 'Quit', click: mb.app.exit },
    ])

    mb.tray.on ('right-click', () => mb.tray.popUpContextMenu(contextMenu))
  });
}

function showAboutDialog() {
  dialog.showMessageBox(null, {
    title: 'About Pulls',
    message: 'About Pulls',
    detail: `Version: ${packageJson.version}`
  });
}

function clearAppData() {
  settingsStore.set('structure', {});
}

function displayAppData() {
  dialog.showMessageBox('App Data', JSON.stringify(settingsStore.get('structure')))
}
