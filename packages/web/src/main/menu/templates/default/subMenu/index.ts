import { BrowserWindow } from 'electron'
import { getSubMenuView } from './view'
import { getFileSubMenu } from './file';

export const getSubMenuItems = (mainWindow: BrowserWindow) => [
    getFileSubMenu(mainWindow),
    getSubMenuView(mainWindow),
];
