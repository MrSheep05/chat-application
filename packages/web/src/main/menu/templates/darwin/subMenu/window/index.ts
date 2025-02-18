import { DarwinMenuItemConstructorOptions } from '../../../../types';

export const subMenuWindow: DarwinMenuItemConstructorOptions = {
  label: 'Window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:',
    },
    { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
    { type: 'separator' },
    { label: 'Bring All to Front', selector: 'arrangeInFront:' },
  ],
};
