import { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { getSubMenuItems } from "./subMenu";

export const getDarwinTemplate = (mainWindow: BrowserWindow): Array<MenuItemConstructorOptions> => getSubMenuItems(mainWindow);
