import { BrowserWindow, shell } from 'electron';

export const setWindowOpenHandler = (window: BrowserWindow) => {
    // Open urls in the user's browser
    window.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });
};
