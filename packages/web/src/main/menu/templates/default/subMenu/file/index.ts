import { BrowserWindow } from 'electron';
import { DarwinMenuItemConstructorOptions } from '../../../../types';

export const getFileSubMenu = (
  mainWindow: BrowserWindow
): DarwinMenuItemConstructorOptions => ({
  label: '&File',
  submenu: [
    {
      label: '&Open',
      accelerator: 'Ctrl+O',
    },
    {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click: () => {
        mainWindow.close();
      },
    },
  ],
});
