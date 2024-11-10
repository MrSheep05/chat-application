import { app, BrowserWindow } from 'electron';
import showNotification from '../../../utils/notification/notification';

export const onMessage = (mainWindow: BrowserWindow, args: any) => {
  if (!mainWindow?.isFocused()) {
    showNotification(app, args);
  }
};
