export type Message = {
  user: string;
  message: string;
  userId: string;
  id: string;
  timestamp: number;
};

export type State = {
  userData?: UserData;
  message: string;
  messages: Message[];
  webSocket?: WebSocket;
  token?: string;
  refreshToken?: string;
  isFetchingMessages: boolean;
  noPreviousMessages: boolean;
};

export type Action =
  | SetWebSocketAction
  | MessageAction
  | MessagesAction
  | RemoveAction
  | TokensRecivedAction
  | SetIsFetchingAction;

export enum Actions {
  setWebSocket = 'setWebSocket',
  newMessage = 'newMessage',
  messages = 'messages',
  remove = 'remove',
  tokensReceived = 'tokensReceived',
  setIsFetching = 'setIsFetching',
}

type SetWebSocketAction = {
  type: Actions.setWebSocket;
  payload?: WebSocket;
};

type SetIsFetchingAction = {
  type: Actions.setIsFetching;
  payload: {
    status: boolean;
  };
};

type MessageAction = {
  type: Actions.newMessage;
  payload: {
    id: string;
    user: string;
    message: string;
    timestamp: number;
    userId: string;
  };
};

type MessagesAction = {
  type: Actions.messages;
  payload: {
    id: string;
    user: string;
    message: string;
    timestamp: number;
    userId: string;
  }[];
};

type RemoveAction = {
  type: Actions.remove;
  payload: string;
};

type TokensRecivedAction = {
  type: Actions.tokensReceived;
  payload: {
    token: string;
    refreshToken: string;
  };
};

export type UserData = {
  username: string;
  userId: string;
};

export type AppStateContext = {
  state: State;
  dispatch: (action: Action) => void;
};

export interface AppStateProps {
  children: JSX.Element[] | JSX.Element;
}
