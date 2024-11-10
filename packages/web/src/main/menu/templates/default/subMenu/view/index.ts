import { BrowserWindow } from "electron";
import { DarwinMenuItemConstructorOptions } from "main/menu/types";

export const getSubMenuView = (
    mainWindow: BrowserWindow,
    enableDevelopmentOptions: boolean
): DarwinMenuItemConstructorOptions => ({
    label: '&View',
    submenu: [
        enableDevelopmentOptions ? {
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
        enableDevelopmentOptions ? {
            label: 'Toggle &Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: () => {
                mainWindow.webContents.toggleDevTools();
            },
        } : null,
    ].filter(item => item !== null),
});
