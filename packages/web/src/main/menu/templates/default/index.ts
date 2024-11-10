import { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { getSubMenuItems } from "./subMenu";

export const getDefaultTemplate = (mainWindow: BrowserWindow): Array<MenuItemConstructorOptions> => getSubMenuItems(mainWindow);
