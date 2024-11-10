import { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { getSubMenuItems } from "./subMenu";

export const getDefaultTemplate = (
    mainWindow: BrowserWindow,
    enableDevelopmentOptions: boolean
): Array<MenuItemConstructorOptions> => getSubMenuItems(mainWindow, enableDevelopmentOptions);
