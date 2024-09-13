import { Channel } from 'common/types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Actions, AppState } from 'renderer/state';

const useUploadAvatar = () => {
  const {
    state: { webSocket },
  } = useContext(AppState);
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);

  useEffect(() => {
    // webSocket?.onmessage();
  }, [webSocket]);

  window.electron.ipcRenderer.on(Channel.FileDialog, (arg) => {
    try {
      console.log('RETURN TYPE', typeof arg);
      setFileBuffer(arg as Uint8Array);
    } catch (_) {}
  });

  const getPresignedUrl = useCallback(() => {
    webSocket?.send(
      JSON.stringify({ action: Actions.requestAvatarUploadUrl, payload: {} })
    );
  }, [webSocket]);
};
