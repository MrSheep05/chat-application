import { Dispatch } from '../../views/ChatView/types';
import { State } from '../../state';

export interface WebSocketMessagePayload {
  [key: string]: any;
}

interface WebSocketHandlerParams {
  dispatch: Dispatch;
  state: State;
  payload: WebSocketMessagePayload;
}

export type WebSocketHandler = (params: WebSocketHandlerParams) => void;

export enum WebsocketActions {
  GET_MESSAGES = 'getMessages',
  MESSAGE = 'message',
  REMOVE = 'remove',
}

export interface WebsocketAction {
  [key: string]: WebSocketHandler;
}

export interface ChatMessage {
  user_id: string;
  message: string;
  visible: number; // TODO: visible: boolean
  username: string;
  timestamp: number;
  avatarKey: string;
}
