import { app } from "electron";
import { DarwinMenuItemConstructorOptions } from "main/menu/types";

export const subMenuAbout: DarwinMenuItemConstructorOptions = {
    label: 'Electron',
    submenu: [
        {
            label: 'Hide ElectronReact',
            accelerator: 'Command+H',
            selector: 'hide:',
        },
        {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
                app.quit();
            },
        },
    ],
};
