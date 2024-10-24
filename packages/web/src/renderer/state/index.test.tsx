import { initialState, Actions } from '.';
import { reducer } from './reducer';

describe('Given the reducer', () => {
  it('should properly handle the setWebSocket action', () => {
    const ws = new WebSocket('ws://localhost:1234');

    const result = reducer(initialState, {
      type: Actions.setWebSocket,
      payload: ws,
    });

    expect(result).toStrictEqual({
      ...initialState,
      webSocket: ws,
    });
  });

  it('should properly handle message action', () => {
    const result = reducer(initialState, {
      type: Actions.messages,
      payload: [
        {
          timestamp: 1685658484333,
          message: 'Test',
          id: '12345',
          userId: '1',
          user: 'Filip',
          avatarKey: 'users/default.png',
        },
      ],
    });

    expect(result).toStrictEqual({
      ...initialState,
      messages: [
        ...initialState.messages,
        {
          timestamp: 1685658484333,
          message: 'Test',
          user: 'Filip',
          userId: '1',
          id: '12345',
        },
      ],
    });
  });

  it('should properly handle remove action', () => {
    const timestamp = 1685658484333;
    const exampleMessages = [
      {
        timestamp,
        user: 'ChatServer',
        message: 'Welcome in chatroom!',
        userId: '0',
        id: '0',
        avatarKey: 'users/default.png',
      },
      {
        timestamp,
        user: 'Filip',
        message: 'Test',
        id: '1',
        userId: '1',
        avatarKey: 'users/default.png',
      },
      {
        timestamp,
        user: 'John',
        message: 'Hello',
        id: '2',
        userId: '2',
        avatarKey: 'users/default.png',
      },
    ];
    const result = reducer(
      { ...initialState, messages: exampleMessages },
      { type: Actions.remove, payload: '2' }
    );
    exampleMessages.pop();
    expect(result).toStrictEqual({
      ...initialState,
      messages: [...exampleMessages],
    });
  });
});
