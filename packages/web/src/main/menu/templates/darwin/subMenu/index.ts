import { BrowserWindow } from "electron"
import { subMenuAbout } from "./about"
import { subMenuEdit } from "./edit"
import { getSubMenuView } from "./view"
import { subMenuWindow } from "./window"

export const getSubMenuItems = (
    mainWindow: BrowserWindow,
    enableDevelopmentOptions: boolean
) => [
        subMenuAbout,
        subMenuEdit,
        getSubMenuView(mainWindow, enableDevelopmentOptions),
        subMenuWindow
    ];
