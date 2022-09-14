import { app, BrowserWindow, shell,Menu, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { menubar } from 'menubar';

import os from 'os';

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const mb = menubar({
  index: app.isPackaged ? indexHtml : url,
  icon: join(process.env.PUBLIC, 'IconTemplate.png'),
  browserWindow: {
    width: 600,
    height: 750,
    transparent: true,
    frame: false,
    resizable: false,
    minimizable: false,
    closable: false,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  }
});

mb.on('ready', () => {
  // sent from the frontend on escape key press
  ipcMain.on('hide-window', () => mb.hideWindow());
});

mb.on('show', () => mb.window.webContents.send('menubar-show'));
mb.on('hide', () => mb.window.webContents.send('menubar-hide'));

mb.on('after-create-window', function () {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: () => shell.openPath(join(os.homedir(), '.pulls-config.yaml')),
    },
    { label: 'Quit', click: () => mb.app.exit() },
  ]);

  mb.tray.on('right-click', () => mb.tray.popUpContextMenu(contextMenu));
});
