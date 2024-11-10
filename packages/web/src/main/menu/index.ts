import {
    Menu,
    BrowserWindow,
} from 'electron';
import { getDarwinTemplate } from './templates/darwin';
import { getDefaultTemplate } from './templates/default';
import { setupDevelopmentEnvironment } from './development';

const enableDevelopmentOptions = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const isDarwinPlatform = process.platform === 'darwin';

export const buildMenu = (mainWindow: BrowserWindow): Menu => {
    if (enableDevelopmentOptions) {
        setupDevelopmentEnvironment(mainWindow);
    }

    const template = isDarwinPlatform
        ? getDarwinTemplate(mainWindow, enableDevelopmentOptions)
        : getDefaultTemplate(mainWindow, enableDevelopmentOptions);

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    return menu;
};
