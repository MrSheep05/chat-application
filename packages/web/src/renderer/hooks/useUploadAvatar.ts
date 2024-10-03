import { Channel, FileCategory } from 'common/types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Actions, AppState } from 'renderer/state';

const useUploadAvatar = (userId: string) => {
  const {
    state: { webSocket, userData },
  } = useContext(AppState);
  const [id, setId] = useState<string>(crypto.randomUUID());
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);
  // const [preSignedUrl, setPreSignedUrl] = useState<string>();
  const [inProgress, setInProgress] = useState<Boolean>(false);

  console.log('fileBuffer', fileBuffer); // <-- to not be undefined

  // useEffect(() => {
  //   webSocket?.onmessage();
  // }, [webSocket]);

  // const getPresignedUrl = useCallback(() => {
  webSocket?.send(
    JSON.stringify({ action: Actions.requestAvatarUploadUrl, payload: {} })
  );
  // }, [webSocket]);

  const onFileDialogResponse = useCallback((arg: unknown) => {
    try {
      console.log('RETURN TYPE', typeof arg);
      setFileBuffer(arg as Uint8Array);
    } catch (error) {
      console.error('Failed', error);
    } finally {
      setInProgress(false);
    }
  }, []);

  useEffect(() => {
    const dispose = window.electron.ipcRenderer.on(
      Channel.FileDialog,
      onFileDialogResponse
    );

    return () => {
      dispose?.();
    };
  }, [onFileDialogResponse]);

  const uploadAvatar = useCallback(() => {
    if (inProgress || userId !== userData?.userId) return;

    setInProgress(true);

    window.electron.ipcRenderer.sendMessage(Channel.FileDialog, [
      { fileCategory: FileCategory.Images },
    ]);
  }, []);

  return { uploadAvatar };
};

export default useUploadAvatar;
