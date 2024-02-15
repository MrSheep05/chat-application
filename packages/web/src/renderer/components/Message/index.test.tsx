import WS from 'jest-websocket-mock';
import { render, screen } from '@testing-library/react';
import MessageBox from '.';
import { AppState, initialState } from '../../state';
import { formatDate } from '../../utils/date';

const WEBSOCKET_ADDRESS =
  'wss://fwbvxi0c4f.execute-api.eu-west-2.amazonaws.com/production';
const timestamp = 1685658484333;

const renderMessageBox = async ({ username = 'Filip' } = {}) => {
  const wsServer = new WS(WEBSOCKET_ADDRESS);
  const client = new WebSocket(WEBSOCKET_ADDRESS);

  await wsServer.connected;

  render(
    <AppState.Provider
      value={{
        state: {
          ...initialState,
          webSocket: client,
          userData: { username, userId: '1' },
        },
        dispatch: jest.fn(),
      }}
    >
      <MessageBox
        timestamp={timestamp}
        user="Filip"
        userId="1"
        message="Hello Everyone"
        index="123"
      />
    </AppState.Provider>
  );

  return { wsServer };
};

describe('Given the MessageBox', () => {
  afterEach(() => {
    WS.clean();
  });

  it('should show the username', async () => {
    await renderMessageBox();

    expect(screen.getByText('Filip')).toBeVisible();
  });

  it('should show the message', async () => {
    await renderMessageBox();

    expect(screen.getByText('Hello Everyone')).toBeVisible();
  });

  it('should show the formatted date of the message', async () => {
    await renderMessageBox();

    expect(screen.getByText(formatDate(timestamp))).toBeVisible();
  });

  it('should render the Message Tooltip with the delete button', async () => {
    await renderMessageBox();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });
});
