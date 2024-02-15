import { createContext, useReducer } from 'react';
import { getUserData } from '../utils/jwt';
import { AppStateContext, State, AppStateProps } from './types';
import { reducer } from './reducer';
import { getTokens } from './electron';

export const AppState = createContext({} as AppStateContext);

const { token, refreshToken } = getTokens();

export const initialState: State = {
  webSocket: undefined,
  isFetchingMessages: false,
  userData: token ? getUserData(token) : undefined,
  message: '',
  messages: [],
  token,
  refreshToken,
  noPreviousMessages: false,
};

const AppStateComponent = ({ children }: AppStateProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  );
};

export default AppStateComponent;
export * from './types';
