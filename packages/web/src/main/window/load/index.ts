import { BrowserWindow } from 'electron';
import { resolveHtmlPath } from '../../util';

export const loadHTMLDocument = (window: BrowserWindow) => {
  window.loadURL(resolveHtmlPath('index.html'));
};
