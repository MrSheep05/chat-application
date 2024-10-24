import {
  StyledDate,
  StyledContainer,
  StyledMessage,
  StyledUsername,
  StyledContent,
  StyledHeader,
  StyledMoreOptions,
} from './styled';
import { MessageBoxProps } from './types';
import MessageTooltip from '../MessageTooltip';
import { formatDate } from '../../utils/date';
import Avatar from '../Avatar';

const Message = ({
  avatarKey,
  timestamp,
  user,
  userId,
  message,
  index,
}: MessageBoxProps) => {
  return (
    <StyledContainer>
      <StyledMoreOptions id="more-options">
        <MessageTooltip userId={userId} index={index} />
      </StyledMoreOptions>
      <Avatar avatarKey={avatarKey} userId={userId} />
      <StyledContent>
        <StyledHeader>
          <StyledUsername variant="caption">{user}</StyledUsername>
          <StyledDate variant="messageDate">{formatDate(timestamp)}</StyledDate>
        </StyledHeader>
        <StyledMessage variant="caption">{message}</StyledMessage>
      </StyledContent>
    </StyledContainer>
  );
};

export default Message;
