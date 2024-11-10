import { BrowserWindow } from 'electron';
import { DarwinMenuItemConstructorOptions } from '../../../../types';
import { isDebug } from '../../../../../utils/environmentVariables';

export const getSubMenuView = (mainWindow: BrowserWindow): DarwinMenuItemConstructorOptions => ({
    label: '&View',
    submenu: [
        isDebug ? {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: () => {
                mainWindow.webContents.reload();
            },
        } : null,
        {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            },
        },
        isDebug ? {
            label: 'Toggle &Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: () => {
                mainWindow.webContents.toggleDevTools();
            },
        } : null,
    ].filter(item => item !== null),
});
