import { app, BrowserWindow } from 'electron';
import SourceMapSupport from 'source-map-support';
import ElectronDebug from 'electron-debug';

import { createWindow, setupMainWindow } from './window';
import { isDarwinPlatform, isDebug, isProduction } from './utils/environmentVariables';
import { listenToIPCEvents } from './ipc';
import { buildMenu } from './menu';
import { enableAutoUpdates } from './autoUpdater';

if (isProduction) {
  SourceMapSupport.install();
}

if (isDebug) {
  ElectronDebug();
}

const createMainWindow = async () => {
  const mainWindow = await createWindow();

  setupMainWindow(mainWindow);
  buildMenu(mainWindow);
  listenToIPCEvents(mainWindow);
  enableAutoUpdates();

  return mainWindow;
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (!isDarwinPlatform) {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    let mainWindow: BrowserWindow | null = await createMainWindow();

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        mainWindow = await createMainWindow();
      };
    });
  })
  .catch(console.log);
