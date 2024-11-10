import { Channel } from '../../common/types';
import { BrowserWindow, ipcMain } from 'electron';
import { onFileDialogEvent } from './handlers/fileDialog';
import { onMessage } from './handlers/message';
import { onStoreGet, onStoreSet } from './handlers/store';

export const listenToIPCEvents = (mainWindow: BrowserWindow) => {
  ipcMain.on(Channel.Message, (_event, args) => onMessage(mainWindow, args));
  ipcMain.on(Channel.FileDialog, onFileDialogEvent);
  ipcMain.on(Channel.ElectronStoreGet, (event, args) =>
    onStoreGet(event, args)
  );
  ipcMain.on(Channel.ElectronStoreSet, (_event, key, value) =>
    onStoreSet(key, value)
  );
};
