import React, { useContext, useEffect, useState } from 'react';

import {
  StyledContainer,
  StyledHeader,
  StyledRoomName,
  StyledRoomIcon,
  StyledDivider,
} from './styled';

import Messages from '../../components/Messages';
import useWebsocket from '../../hooks/useWebSocket';
import MessageInput from '../../components/MessageInput';
import ConnectingMessage from '../../components/ConnectingMessage';
import {
  onWebsocketMessage,
  onWebsocketOpen,
} from '../../utils/websocket/handlers';

import { AppState, Actions } from '../../state';

const ChatView = () => {
  const { state, dispatch } = useContext(AppState);
  const [inputMessage, setInputMessage] = useState<string>('');
  const websocket = useWebsocket(
    (data) => {
      onWebsocketMessage(dispatch, state, data);
    },
    (ws) => {
      if (ws) {
        onWebsocketOpen(state, ws);
      }
    }
  );

  useEffect(() => {
    dispatch({ type: Actions.setWebSocket, payload: websocket });
  }, [websocket, dispatch]);

  if (!websocket) {
    return <ConnectingMessage />;
  }

  const sendMessage = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const json = JSON.stringify({
      action: 'message',
      payload: {
        message: inputMessage,
      },
    });

    if (websocket) {
      websocket.send(json);
    }

    setInputMessage('');
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledRoomIcon />
        <StyledRoomName>general</StyledRoomName>
      </StyledHeader>

      <StyledDivider variant="fullWidth" />
      <Messages />
      <MessageInput
        onSubmit={sendMessage}
        value={inputMessage}
        onChange={setInputMessage}
      />
    </StyledContainer>
  );
};

export default ChatView;
