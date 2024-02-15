const mockedToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSTkFNRSJ9.C7mKp_BtLkcfTkkVGd5s_BXPpTN1iqRO6qagebK8Hek';

const mockedRefreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU2VSTkFNFSJ9.C7mKp_BtLkcfTkkVGd5s_BXPpTN1iqRO6qagebK8Hek';

jest.mock('../utils/index', () => {
  return {
    request: jest.fn().mockResolvedValue({
      token: mockedToken,
      refreshToken: mockedRefreshToken,
    }),
  };
});

jest.mock('react', () => {
  const originalMethods = jest.requireActual('react');

  return {
    ...originalMethods,
    useReducer: jest
      .fn()
      .mockReturnValue([
        { token: 'test-token', refreshToken: 'test-refresh-token' },
        jest.fn(),
      ]),
  };
});

jest.mock('react-router-dom', () => {
  const originalMethods = jest.requireActual('react');

  return {
    ...originalMethods,
    useNavigate: jest.fn().mockReturnValue(jest.fn()),
  };
});

import WS from 'jest-websocket-mock';
import { waitFor, renderHook, act } from '@testing-library/react';
import AppStateComponent from '../state';
import { request } from '../utils/index';
import useWebSocket from './useWebSocket';
import { ReactElement, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

const url = 'wss://fwbvxi0c4f.execute-api.eu-west-2.amazonaws.com/production';
const wrapper = ({ children }: { children: ReactElement<any> }) => {
  return <AppStateComponent>{children}</AppStateComponent>;
};

const useHook = async (onMessage = jest.fn()) => {
  const dispatchSpy = jest.fn();
  const mockedUseReducer = useReducer as jest.Mock;

  mockedUseReducer.mockReturnValue([
    { token: 'test-token', refreshToken: 'test-refresh-token' },
    dispatchSpy,
  ]);

  const wsServer = new WS(url);
  let lastConnection: WebSocket | undefined;

  wsServer.on('connection', (connection) => {
    lastConnection = connection as WebSocket;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { result } = renderHook(() => useWebSocket(onMessage), {
    wrapper,
  });

  await wsServer.connected;

  return {
    result,
    wsServer,
    dispatchSpy,
    lastConnection,
  };
};

const wait = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));

describe('Given the useWebSocketHook', () => {
  afterEach(async () => {
    await act(async () => {
      WS.clean();
      await wait(100); // Wait for this garbage to clean up properly
    });
  });

  it('should return the webSocket connection with valid url', async () => {
    const { lastConnection } = await useHook();

    expect(lastConnection?.url).toContain(url);
  });

  it('should provide token as a query parameter', async () => {
    const { lastConnection } = await useHook();

    expect(lastConnection?.url).toContain('test-token');
  });

  it('should set the ready state when connected', async () => {
    const { lastConnection } = await useHook();

    expect(lastConnection?.readyState).toBe(1);
  });

  it('should return webSocket', async () => {
    const { result } = await useHook();

    expect(result.current).not.toBe(undefined);
  });

  describe('When a message is sent from a server', () => {
    it('should trigger the onMessage callback provided to the hook', async () => {
      const onMessageSpy = jest.fn();
      const { wsServer } = await useHook(onMessageSpy);

      wsServer.send('message');

      expect(onMessageSpy).toHaveBeenCalledWith('message');
    });
  });

  describe('When webSocket is dissconnected', () => {
    it('Should return undefined', async () => {
      const { result, wsServer } = await useHook();

      await act(() => wsServer.close());
      await waitFor(() => expect(result.current).toBe(undefined));
    });
  });

  describe('When a connection is temporarily lost to the server', () => {
    it('should make a request to the /refresh endpoint to retrieve new tokens', async () => {
      const { lastConnection } = await useHook();

      await act(() => lastConnection && lastConnection.close());
      await waitFor(() =>
        expect(request).toHaveBeenCalledWith({
          path: '/refresh',
          body: JSON.stringify({
            token: 'test-token',
            refreshToken: 'test-refresh-token',
          }),
          method: 'POST',
        })
      );
    });

    it('should call dispatch to update the state with newly recived tokens', async () => {
      const { dispatchSpy, lastConnection } = await useHook();

      await waitFor(() => expect(lastConnection).toBeTruthy());
      await act(() => lastConnection && lastConnection.close());
      await waitFor(() =>
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: 'tokensReceived',
          payload: { token: mockedToken, refreshToken: mockedRefreshToken },
        })
      );
    });

    it('should reconnect to the webSocket', async () => {
      const { lastConnection, wsServer } = await useHook();
      let newConnection: WebSocket | undefined;

      wsServer.on('connection', (connection) => {
        newConnection = connection as WebSocket;
      });

      await waitFor(() => expect(lastConnection).toBeTruthy());
      await act(() => lastConnection && lastConnection.close());
      await waitFor(() => expect(newConnection?.readyState).toBe(1));
    });

    it('should use newly recived token as a query param', async () => {
      const { lastConnection, wsServer } = await useHook();
      let newConnection: WebSocket | undefined;

      wsServer.on('connection', (connection) => {
        newConnection = connection as WebSocket;
      });

      await act(() => lastConnection && lastConnection.close());
      await waitFor(() =>
        expect(newConnection?.url).toContain(`?token=${mockedToken}`)
      );
    });
  });

  describe('When we receive an error from the refresh endpoint', () => {
    it('should navigate user to LoginForm', async () => {
      const mockedRequest = request as jest.Mock;
      const mockedUseNavigate = useNavigate as jest.Mock;
      const navigateSpy = jest.fn();

      mockedRequest.mockRejectedValue(new Error('Surprise'));
      mockedUseNavigate.mockReturnValue(navigateSpy);

      const { lastConnection } = await useHook();

      await act(() => lastConnection && lastConnection.close());
      await waitFor(() => expect(navigateSpy).toHaveBeenCalledWith('/login'));
    });
  });
});
