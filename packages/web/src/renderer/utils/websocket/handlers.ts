import { Actions, State } from '../../state';
import { Dispatch } from '../../views/ChatView/types';
import {
  ChatMessage,
  WebSocketHandler,
  WebSocketMessagePayload,
  WebsocketAction,
  WebsocketActions,
} from './types';

const onNewMessage: WebSocketHandler = ({ dispatch, state, payload }) => {
  const { message, username, id, timestamp, user_id, avatarKey } = payload;
  console.log('OnNewMessage response', payload);

  dispatch({
    type: Actions.newMessage,
    payload: {
      message,
      user: username,
      id,
      timestamp,
      userId: user_id,
      avatarKey,
    },
  });

  if (user_id !== state?.userData?.userId) {
    window.electron.ipcRenderer.sendMessage('message', [username, message]);
  }
};

const onRemoveMessage: WebSocketHandler = ({ dispatch, payload }) => {
  const { id } = payload;
  console.log('OnRemoveMessage response', id);

  dispatch({ type: Actions.remove, payload: id });
};

const onGetMessages: WebSocketHandler = ({ dispatch, payload }) => {
  const messages = payload.messages.map(
    ({ user_id, username: user, ...other }: ChatMessage) => {
      return { userId: user_id, user, ...other };
    }
  );
  console.log('GetMessage response', messages);
  dispatch({ type: Actions.messages, payload: messages });
};

const WEBSOCKET_ACTIONS: WebsocketAction = {
  [WebsocketActions.MESSAGE]: onNewMessage,
  [WebsocketActions.REMOVE]: onRemoveMessage,
  [WebsocketActions.GET_MESSAGES]: onGetMessages,
};

export const onWebsocketMessage = (
  dispatch: Dispatch,
  state: State,
  data: string
) => {
  const { action, payload } = JSON.parse(data) as {
    action: string;
    payload: WebSocketMessagePayload;
  };

  if (!action || !Object.keys(WEBSOCKET_ACTIONS).includes(action)) return;

  WEBSOCKET_ACTIONS[action]({ dispatch, state, payload });
};

export const onWebsocketOpen = (state: State, websocket: WebSocket) => {
  const [oldestMessage] = state.messages;
  const { id } = oldestMessage ?? {};
  const data = JSON.stringify({
    action: WebsocketActions.GET_MESSAGES,
    payload: { ...(id && { oldestMessageId: id }) },
  });

  websocket.send(data);
};
