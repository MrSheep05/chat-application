import avatarTemplate from '../../../../assets/avatar.jpeg';
import {
  StyledDate,
  StyledContainer,
  StyledMessage,
  StyledUsername,
  StyledContent,
  StyledHeader,
  StyledMoreOptions,
  StyledAvatar,
} from './styled';
import { MessageBoxProps } from './types';
import MessageTooltip from '../MessageTooltip';
import { formatDate } from '../../utils/date';

const Message = ({
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
      <StyledAvatar src={avatarTemplate} />
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
