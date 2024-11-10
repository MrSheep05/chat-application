import { BrowserWindow } from "electron";
import { DarwinMenuItemConstructorOptions } from "main/menu/types";

export const getSubMenuView = (
    mainWindow: BrowserWindow,
    enableDevelopmentOptions: boolean
): DarwinMenuItemConstructorOptions => ({
    label: 'View',
    submenu: [
        enableDevelopmentOptions ? {
            label: 'Reload',
            accelerator: 'Command+R',
            click: () => {
                mainWindow.webContents.reload();
            },
        } : null,
        {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            },
        },
        enableDevelopmentOptions ? {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click: () => {
                mainWindow.webContents.toggleDevTools();
            },
        } : null,
    ].filter(item => item !== null),
});
