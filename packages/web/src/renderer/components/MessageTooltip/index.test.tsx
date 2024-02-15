import WS from 'jest-websocket-mock';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageTooltip from '.';
import { AppState, initialState } from '../../state';

const WEBSOCKET_ADDRESS =
  'wss://fwbvxi0c4f.execute-api.eu-west-2.amazonaws.com/production';

const renderMessageTooltip = async ({
  username = 'Filip',
  userId = '1',
} = {}) => {
  const wsServer = new WS(WEBSOCKET_ADDRESS);
  const client = new WebSocket(WEBSOCKET_ADDRESS);

  await wsServer.connected;

  render(
    <AppState.Provider
      value={{
        state: {
          ...initialState,
          webSocket: client,
          userData: { username, userId },
        },
        dispatch: jest.fn(),
      }}
    >
      <MessageTooltip userId="1" index="123" />
    </AppState.Provider>
  );

  return { wsServer };
};

describe('Given the MessageBox', () => {
  afterEach(() => {
    WS.clean();
  });

  describe('When user clicks remove button on their message', () => {
    const deleteMessage = async () => {
      const deleteButton = screen.getByLabelText('Delete');
      fireEvent.click(deleteButton);
    };

    it('should send data to server to remove the message', async () => {
      const { wsServer } = await renderMessageTooltip();

      deleteMessage();

      await expect(wsServer).toReceiveMessage(
        JSON.stringify({ action: 'remove', payload: { id: '123' } })
      );
    });
  });

  describe('When there is only one message from another user', () => {
    it('should not render the delete button', async () => {
      await renderMessageTooltip({ username: 'Tomasz', userId: '10' });

      expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
    });
  });
});
