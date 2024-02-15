jest.mock('react-router-dom', () => {
  const originalMethods = jest.requireActual('react');

  return {
    ...originalMethods,
    useNavigate: jest.fn().mockReturnValue(jest.fn()),
  };
});

import WS from 'jest-websocket-mock';
import { fireEvent, render, screen } from '@testing-library/react';
import ChatView from '.';
import { AppState, initialState, State, Message } from '../../state';

const exampleMessages: Message[] = [
  {
    timestamp: 1685658484333,
    user: 'ChatServer',
    userId: '0',
    message: 'Welcome in chatroom!',
    id: '0',
  },
  {
    timestamp: 1685658484333,
    user: 'Filip',
    message: 'Test',
    id: '123',
    userId: '20',
  },
];

const createWebSocketServer = () => {
  return new WS(
    'wss://fwbvxi0c4f.execute-api.eu-west-2.amazonaws.com/production'
  );
};

const renderChatView = (state?: State) => {
  const sendMessageSpy = jest.spyOn(window.electron.ipcRenderer, 'sendMessage');
  const dispatchSpy = jest.fn();

  render(
    <AppState.Provider
      value={{
        state: {
          ...initialState,
          messages: exampleMessages,
          ...state,
        },
        dispatch: dispatchSpy,
      }}
    >
      <ChatView />
    </AppState.Provider>
  );

  return { dispatchSpy, sendMessageSpy };
};

describe('Given the Chat View', () => {
  afterEach(() => {
    WS.clean();
  });

  describe('When rendered', () => {
    describe('And the WebSocket is still connecting', () => {
      it('should show connecting state', () => {
        createWebSocketServer();

        renderChatView();

        expect(screen.getByText('Connecting...')).toBeVisible();
      });
    });

    describe('And the WebSocket connects', () => {
      const renderAndWaitForConnection = async () => {
        const wsServer = createWebSocketServer();
        const renderChatViewOutput = renderChatView();

        await wsServer.connected;

        return { wsServer, ...renderChatViewOutput };
      };

      it('should show welcoming message', async () => {
        await renderAndWaitForConnection();

        expect(screen.getByText('Welcome in chatroom!')).toBeVisible();
      });

      it('should show messages in the chatroom', async () => {
        await renderAndWaitForConnection();

        expect(screen.getByText('Test')).toBeVisible();
        expect(screen.getByText('Filip')).toBeVisible();
      });

      describe('And the user sends a message', () => {
        const sendMessage = (message: string) => {
          const messageInput = screen.getByPlaceholderText('Message @general');

          fireEvent.change(messageInput, { target: { value: message } });
          fireEvent.submit(messageInput);
        };

        it('should send message to server', async () => {
          const { wsServer } = await renderAndWaitForConnection();

          sendMessage('Test');

          await expect(wsServer).toReceiveMessage(
            JSON.stringify({
              action: 'message',
              payload: {
                message: 'Test',
              },
            })
          );
        });
      });

      describe('And a message is received from the server', () => {
        const sendMessageFromServer = ({
          wsServer,
          username,
          message,
        }: {
          wsServer: WS;
          username: string;
          message: string;
        }) => {
          wsServer.send(
            JSON.stringify({
              action: 'message',
              payload: {
                username,
                message,
                id: '123',
              },
            })
          );
        };

        describe('And the author of the message is us', () => {
          it('should not send a notification', async () => {
            const { wsServer, sendMessageSpy } =
              await renderAndWaitForConnection();

            sendMessageFromServer({
              wsServer,
              username: 'filip',
              message: 'Test',
            });

            expect(sendMessageSpy).not.toHaveBeenCalledWith();
          });

          it('should execute dispatch to add the message to the state', async () => {
            const { wsServer, dispatchSpy } =
              await renderAndWaitForConnection();

            sendMessageFromServer({
              wsServer,
              username: 'filip',
              message: 'Test',
            });

            expect(dispatchSpy).toHaveBeenCalledWith({
              type: 'message',
              payload: {
                user: 'filip',
                message: 'Test',
                id: '123',
              },
            });
          });
        });

        describe('And the author of the message is someone else', () => {
          it('should send a notification', async () => {
            const { wsServer, sendMessageSpy } =
              await renderAndWaitForConnection();

            sendMessageFromServer({
              wsServer,
              username: 'tomasz',
              message: 'Test',
            });

            expect(sendMessageSpy).toHaveBeenCalledWith('message', [
              'tomasz',
              'Test',
            ]);
          });

          it('should execute dispatch to add the message to the state', async () => {
            const { wsServer, dispatchSpy } =
              await renderAndWaitForConnection();

            sendMessageFromServer({
              wsServer,
              username: 'tomasz',
              message: 'Test',
            });

            expect(dispatchSpy).toHaveBeenCalledWith({
              type: 'message',
              payload: {
                user: 'tomasz',
                message: 'Test',
                id: '123',
              },
            });
          });
        });
      });

      describe('And a remove message is received from the server', () => {
        it('should execute dispatch', async () => {
          const { wsServer, dispatchSpy } = await renderAndWaitForConnection();

          wsServer.send(
            JSON.stringify({ action: 'remove', payload: { id: '123' } })
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: 'remove',
            payload: '123',
          });
        });
      });
    });
  });
});
