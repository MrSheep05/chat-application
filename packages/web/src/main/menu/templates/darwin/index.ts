import { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { getSubMenuItems } from "./subMenu";

export const getDarwinTemplate = (
    mainWindow: BrowserWindow,
    enableDevelopmentOptions: boolean
): Array<MenuItemConstructorOptions> => getSubMenuItems(mainWindow, enableDevelopmentOptions);
