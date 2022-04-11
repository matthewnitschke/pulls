const { ipcMain, globalShortcut, Menu, BrowserWindow, dialog, app, shell } = require('electron');
const { menubar } = require('menubar');

const packageJson = require('./package.json');

const { settingsStore } = require('./src/utils.js');
const path = require('path');

const { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const isDebug = process.env.DEBUG == 'true';

const menu = [
  { 
    label: 'About Pulls', 
    click: () => {
      dialog.showMessageBox(null, {
        title: 'About Pulls',
        message: 'About Pulls',
        detail: `Version: ${packageJson.version}`,
      });
    },
  },
  {
    label: 'Preferences',
    click: () => shell.openPath(path.join(homedir, '.pulls-config.yaml')),
  },
  ...(isDebug ? [{ 
    label: 'Clear All Structure',
    click: () => settingsStore.set('structure', {}),
  }] : []),
  { 
    label: 'Quit', 
    click: () => {
      if (isDebug) {
        app.exit();
      } else {
        mb.app.exit();
      }
    }
  },
];

const windowSettings = {
  width: 600,
  height: 750,
  ...(!isDebug
    ? {
        transparent: true,
        frame: false,
        resizable: false,
        minimizable: false,
        closable: false,
        titleBarStyle: 'customButtonsOnHover',
      }
    : {}),
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
};

if (isDebug) {
  app.whenReady().then(async () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Test',
        submenu: menu
      }
    ]))
    
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
      loadExtensionOptions: { allowFileAccess: true },
    })
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    let win = new BrowserWindow(windowSettings);
    win.loadFile(`${__dirname}/dist/index.html`);

  });



} else {
  let mb = menubar({
    dir: `${__dirname}/dist`,
    icon: `${__dirname}/IconTemplate.png`,
    browserWindow: windowSettings,
  });

  mb.on('ready', () => {
    // sent from the frontend on escape key press
    ipcMain.on('hide-window', () => mb.hideWindow());
    mb.tray.on('right-click', () => mb.tray.popUpContextMenu(Menu.buildFromTemplate(menu)));
  });

  mb.on('show', () => mb.window.webContents.send('menubar-show'));
  mb.on('hide', () => mb.window.webContents.send('menubar-hide'));
}
