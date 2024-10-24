import { useContext } from 'react';
import { AppState } from '../../state';
import { StyledTooltip, DeleteMessageButton, DeleteIcon } from './styled';
import { MessageTooltipProps } from './types';

const MessageTooltip = ({ userId, index }: MessageTooltipProps) => {
  const { state } = useContext(AppState);
  const { userData, webSocket } = state;
  console.log(`user ${userId} username ${userData?.userId}`);

  const remove = () => {
    if (webSocket && userData?.userId === userId) {
      webSocket.send(
        JSON.stringify({
          action: 'remove',
          payload: { id: index },
        })
      );
    }
  };

  if (userData?.userId !== userId || !userData) {
    return <></>;
  }

  return (
    <StyledTooltip placement="top" title="Delete" aria-label="Message Tooltip">
      <DeleteMessageButton onClick={remove} aria-label="Delete">
        <DeleteIcon />
      </DeleteMessageButton>
    </StyledTooltip>
  );
};

export default MessageTooltip;
