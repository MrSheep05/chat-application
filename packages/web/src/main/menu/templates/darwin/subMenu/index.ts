import { BrowserWindow } from "electron"
import { subMenuAbout } from "./about"
import { subMenuEdit } from "./edit"
import { getSubMenuView } from "./view"
import { subMenuWindow } from "./window"

export const getSubMenuItems = (mainWindow: BrowserWindow) => [
    subMenuAbout,
    subMenuEdit,
    getSubMenuView(mainWindow),
    subMenuWindow
];
