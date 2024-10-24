import { useCallback, useContext, useEffect, useRef } from 'react';
import Message from '../Message';
import { Actions, AppState, Message as MessageType } from '../../state';
import ScrollableView from '../ScrollableView';
import MessagesPlaceholder from '../MessagesPlaceholder';

const renderMessages = (messages: MessageType[]): JSX.Element[] => {
  console.log('messages', messages);
  return messages.map(({ avatarKey, user, message, id, timestamp, userId }) => (
    <Message
      key={`messageContainer${id}`}
      avatarKey={avatarKey}
      timestamp={timestamp}
      user={user}
      userId={userId}
      message={message}
      index={id}
    />
  ));
};

const Messages = () => {
  const { state, dispatch } = useContext(AppState);
  const scrollRef = useRef<any | null>(null);
  const { isFetchingMessages, messages, webSocket, noPreviousMessages } = state;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages, scrollRef]);

  const onReachedTop = useCallback(() => {
    if (isFetchingMessages || noPreviousMessages) return;
    if (webSocket) {
      dispatch({
        type: Actions.setIsFetching,
        payload: {
          status: true,
        },
      });
      const [oldestMessage] = messages;

      console.log('Sending webSocket getMessages', oldestMessage);

      if (!oldestMessage?.id) {
        return;
      }

      const { id } = oldestMessage;

      webSocket.send(
        JSON.stringify({
          action: 'getMessages',
          payload: {
            oldestMessageId: id,
          },
        })
      );
    }
  }, [isFetchingMessages, messages, webSocket, noPreviousMessages]);

  return (
    <ScrollableView
      // innerRef={scrollRef}
      header={<div>hello</div>}
      onReachedTop={() => onReachedTop()}
    >
      <>{isFetchingMessages ? <MessagesPlaceholder /> : null}</>
      <>{renderMessages(messages)}</>
      <div ref={scrollRef}></div>
    </ScrollableView>
  );
};

export default Messages;
