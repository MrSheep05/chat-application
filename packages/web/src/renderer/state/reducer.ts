import { Action, Actions, State } from './types';

import { getUserData } from '../utils/jwt';
import { storeTokens } from './electron';

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.setWebSocket: {
      console.log('SET WEBSOCKET ', action.payload);
      return { ...state, webSocket: action.payload };
    }
    case Actions.newMessage: {
      const newMessages = [...state.messages, action.payload];

      return { ...state, messages: newMessages };
    }
    case Actions.messages: {
      const newMessages = [...action.payload, ...state.messages];
      const noPreviousMessages =
        action.payload.length < 20 ? true : state.noPreviousMessages;

      return {
        ...state,
        isFetchingMessages: false,
        messages: newMessages,
        noPreviousMessages,
      };
    }
    case Actions.remove: {
      const withoutRemoved = state.messages.filter(({ id }) => {
        return id !== action.payload;
      });
      return { ...state, messages: withoutRemoved };
    }
    case Actions.tokensReceived: {
      const { token, refreshToken } = action.payload;
      console.log(action.payload);
      const userData = getUserData(token);

      storeTokens({ token, refreshToken });

      return { ...state, token, refreshToken, userData };
    }
    case Actions.setIsFetching: {
      const { status } = action.payload;
      return { ...state, isFetchingMessages: status };
    }
    default: {
      return { ...state };
    }
  }
};
