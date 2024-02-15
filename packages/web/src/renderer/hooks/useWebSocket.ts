import { useState, useEffect, useContext } from 'react';
import { AppState, Actions } from '../state';
import { request } from '../utils/index';
import { useNavigate } from 'react-router-dom';

const WEBSOCKET_ADDRESS =
  'wss://fwbvxi0c4f.execute-api.eu-west-2.amazonaws.com/production';

type OnMessage = (data: string) => void;
type OnOpen = (websocket: WebSocket | undefined) => void;

const prepareListener = (
  eventName: keyof WebSocketEventMap,
  webSocket: WebSocket | undefined,
  fn: (...params: any[]) => void // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  if (!webSocket) {
    return () => {
      // do nothing
    };
  }

  webSocket.addEventListener(eventName, fn);

  return () => {
    webSocket.removeEventListener(eventName, fn);
  };
};

const buildWebSocketAddress = (token?: string) =>
  `${WEBSOCKET_ADDRESS}?token=${token}`;

const useWebSocket = (onMessage: OnMessage, onOpen?: OnOpen) => {
  const { state, dispatch } = useContext(AppState);
  const { token, refreshToken } = state;
  const [webSocket, setWebsocket] = useState<WebSocket>();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !refreshToken) {
      navigate('/login');
    }

    if (!webSocket) {
      const ws = new WebSocket(buildWebSocketAddress(token));
      setWebsocket(ws);
    }
  }, [token, webSocket]);

  // executes functions when websocket is updated
  useEffect(() => {
    if (!webSocket) {
      return;
    }

    prepareListener('close', webSocket, async () => {
      try {
        const { token: newToken, refreshToken: newRefreshToken } =
          await request({
            path: '/refresh',
            method: 'POST',
            body: JSON.stringify({ token, refreshToken }),
          });

        if (newToken && newRefreshToken) {
          dispatch({
            type: Actions.tokensReceived,
            payload: { token: newToken, refreshToken: newRefreshToken },
          });

          const ws = new WebSocket(buildWebSocketAddress(newToken));
          setWebsocket(ws);
          setIsAvailable(false);
        }
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    });

    prepareListener('error', webSocket, () => {
      webSocket.close();
    });
  }, [dispatch, token, refreshToken, webSocket]);

  // executes functions when websocket or onMessage is updated
  useEffect(() => {
    return prepareListener(
      'message',
      webSocket,
      (event: MessageEvent<string>) => {
        onMessage(event.data);
      }
    );
  }, [webSocket, onMessage]);

  useEffect(() => {
    return prepareListener('open', webSocket, () => {
      setIsAvailable(true);
      if (onOpen) onOpen(webSocket);
    });
  }, [webSocket, onOpen]);

  return isAvailable ? webSocket : undefined;
};

export default useWebSocket;
