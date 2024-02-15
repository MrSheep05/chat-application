import { Channels } from 'main/preload';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    messageDate: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    messageDate?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    messageDate: true;
  }
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };
    };
  }
}

export {};
