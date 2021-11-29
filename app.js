
const { ipcMain, globalShortcut, Menu, BrowserWindow, dialog, app } = require('electron');
const { menubar } = require('menubar');

const package = require('./package.json');
const settings = require('./src/components/settings/settings-utils.js');

const isDebug = process.env.DEBUG == "true";

const windowSettings = {
  width: 600,
  height: 700,
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
  app.whenReady().then(() => {
    // settings.setDefaults();
    let win = new BrowserWindow(windowSettings);
    win.loadFile(`${__dirname}/dist/index.html`)
  })
} else {
  let mb = menubar({
    dir: `${__dirname}/dist`,
    icon: `${__dirname}/Icon.png`,
    browserWindow: windowSettings,
  });
  
  mb.on('ready', () => {
    settings.setDefaults();

    // Register a 'CommandOrControl+Shift+P' shortcut listener.
    const hotkeyRegistration = globalShortcut.register('CommandOrControl+Shift+P', () => {
      mb.showWindow()
    })
  
    if (!hotkeyRegistration) {
      console.log('CommandOrControl+Shift+P registration failed');
    }
  
    // sent from the frontend on escape key press
    ipcMain.on('hide-window', () => {
      mb.hideWindow();
    })

    ipcMain.on('show-settings', showSettingsWindow);
  })
  
  mb.on('show', () => {
    mb.window.webContents.send('menubar-show');
  })
  
  mb.on('hide', () => {
    mb.window.webContents.send('menubar-hide');
  });
  
  
  mb.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })

  //right click menu for Tray
  mb.on('after-create-window', function() {
    const contextMenu = Menu.buildFromTemplate ([
      {label: 'About Pulls', click: showAboutDialog},
      {label: 'Preferences', click: showSettingsWindow},
      {label: 'Clear App Data', click: clearAppData},
      {label: 'Quit', click: () => {
        mb.app.quit();
      }},
    ])
    mb.tray.on ('right-click', () => {
        mb.tray.popUpContextMenu (contextMenu);
    })
  });
}

function showSettingsWindow() {
  let win = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.on('closed', () => {
    win = null
  });
  win.loadURL(`file://${__dirname}/dist/settings-editor.html`);
}

function showAboutDialog() {
  dialog.showMessageBox(null, {
    title: 'About Pulls',
    message: 'About Pulls',
    detail: `Version: ${package.version}`
  });
}

function clearAppData() {
  settings.delete('savedStructure');
}