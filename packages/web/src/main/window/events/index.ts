import { app, BrowserWindow } from 'electron';

export const listenToWindowEvents = (window: BrowserWindow) => {
    window.on('ready-to-show', () => {
        if (!window) {
            throw new Error('mainWindow is not defined');
        }
        if (process.env.START_MINIMIZED) {
            window.minimize();
        } else {
            window.show();
        }
    });

    window.on('focus', () => {
        app.setBadgeCount(0);
    });
};
