import { Menu, BrowserWindow } from 'electron';
import { getDarwinTemplate } from './templates/darwin';
import { getDefaultTemplate } from './templates/default';
import { setupDevelopmentEnvironment } from './development';
import { isDarwinPlatform, isDebug } from '../utils/environmentVariables';

export const buildMenu = (mainWindow: BrowserWindow): Menu => {
  if (isDebug) {
    setupDevelopmentEnvironment(mainWindow);
  }

  const template = isDarwinPlatform
    ? getDarwinTemplate(mainWindow)
    : getDefaultTemplate(mainWindow);

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);

  return menu;
};
