import { BrowserWindow } from 'electron';

import { isDebug } from '../utils/environmentVariables';
import { installExtensions } from './extensions';
import { listenToWindowEvents } from './events';
import { loadHTMLDocument } from './load';
import { setWindowOpenHandler } from './webContents';
import { getAssetPath, getPreloadScriptPath } from './assets';

export const createWindow = async (): Promise<BrowserWindow> => {
    if (isDebug) {
        await installExtensions();
    }

    return new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: getPreloadScriptPath()
        }
    });
};

export const setupMainWindow = (mainWindow: BrowserWindow) => {
    listenToWindowEvents(mainWindow);
    loadHTMLDocument(mainWindow);
    setWindowOpenHandler(mainWindow);
};
