/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import MenuBuilder from './menu';

const isMac = process.platform === 'darwin'
var closed = false;

// Match build.appId
app.setAppUserModelId("fribbelse7optimizer");
app.setAsDefaultProtocolClient('fribbelse7optimizer');

const template = [
   {
      label: 'File',
      submenu: [
         isMac ? { role: 'close' } : { role: 'quit' }
      ]
   },

   {
      label: 'View',
      submenu: [
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'reload'
         },
         {
            role: 'forcereload'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },
   {
      role: 'window',
      submenu: [
         {
            role: 'minimize'
         },
         {
            role: 'close'
         }
      ]
   },

   {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/fribbels/Fribbels-Epic-7-Optimizer')
          }
        }
      ]
   }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.allowDowngrade = true;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

console.log("main.dev.ts");

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (paths) => {
    return path.join(RESOURCES_PATH, paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 1000,
    icon: getAssetPath('icon.png'),
    webPreferences:
      (process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true') && process.env.ERB_SECURE !== 'true' ?
      {
        nodeIntegration: true,
        enableRemoteModule: true
      } :
      {
        preload: path.join(__dirname, 'dist/renderer.prod.js'),
        nodeIntegration: true,
        enableRemoteModule: true
      },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  // mainWindow.webContents.openDevTools();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('resize', () => {
    mainWindow.webContents.send('resize');
  });

  mainWindow.on('resized', () => {
    mainWindow.webContents.send('resized');
  });

  mainWindow.on('close', (e) => {
    if (!closed) {
      e.preventDefault();
      mainWindow.webContents.send('app-close');
    }
  });

  ipcMain.on('closed', _ => {
    closed = true;
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });


  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line

  new AppUpdater();

  require('update-electron-app')({
    repo: 'fribbels/Fribbels-Epic-7-Optimizer',
    updateInterval: '5 minutes',
    // logger: require('electron-log')
  })
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


ipcMain.on('test', async (event) => {
  const updates = await autoUpdater.checkForUpdates()
  console.log("TEST UPDATES")
  console.log(updates)
  event.sender.send('test', JSON.stringify(updates));
});

ipcMain.on('check', async (event) => {
  const updates = await autoUpdater.checkForUpdatesAndNotify()
  console.log(updates)
  event.sender.send('check', updates);
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', (data) => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', (data) => {
  console.log("DOWNLOADED");
  console.log(data);
  mainWindow.webContents.send('update_downloaded', data);
});
autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update_not_available');
});