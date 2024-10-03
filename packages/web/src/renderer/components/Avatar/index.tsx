import { useCallback, useContext } from 'react';
import avatarTemplate from '../../../../assets/avatar.jpeg';
import { StyledAvatar } from './styled';
import { Channel, FileCategory } from 'common/types';
import { Actions, AppState } from 'renderer/state';

interface ISendFileParams {
  buffer: ArrayBuffer;
  url: string;
}

const sendFile = async ({ buffer, url }: ISendFileParams) => {
  fetch(url, { method: 'PUT', body: buffer });
};

const getPresignedUrl = (webSocket: WebSocket): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('Timeout');
    }, 5000);

    const cleanup = () => {
      webSocket.removeEventListener('message', callback);
      clearTimeout(timeout);
    };

    const callback = (event: MessageEvent) => {
      try {
        const { payload, action } = JSON.parse(event.data);

        if (action === Actions.requestAvatarUploadUrl) {
          if (!payload.url) {
            throw new Error('url is invalid');
          }
          cleanup();
          resolve(payload.url);
        }
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    webSocket.addEventListener('message', callback);
    webSocket.send(
      JSON.stringify({ action: Actions.requestAvatarUploadUrl, payload: {} })
    );
  });
};

const openFile = (): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const onFileDialogResponse = (arg: unknown) => {
      if (arg instanceof Uint8Array) {
        resolve(arg);
      } else {
        reject('Unexpected format');
      }
    };

    window.electron.ipcRenderer.once(Channel.FileDialog, onFileDialogResponse);
    window.electron.ipcRenderer.sendMessage(Channel.FileDialog, [
      { fileCategory: FileCategory.Images },
    ]);
  });
};

const uploadAvatar = async (webSocket: WebSocket) => {
  try {
    const openedFile = await openFile();
    const preSignedUrl = await getPresignedUrl(webSocket);

    await sendFile({
      buffer: openedFile.buffer,
      url: preSignedUrl,
    });
  } catch (e) {
    console.error(e);
  }
};

const Avatar = ({ avatarUrl, userId }: AvatarProps) => {
  const {
    state: { webSocket, userData },
  } = useContext(AppState);

  const onAvatarClick = useCallback(async () => {
    if (userId !== userData?.userId || !webSocket) {
      return;
    }

    await uploadAvatar(webSocket);
  }, [userId, userData]);

  return (
    <StyledAvatar src={avatarUrl ?? avatarTemplate} onClick={onAvatarClick} />
  );
};

export default Avatar;
