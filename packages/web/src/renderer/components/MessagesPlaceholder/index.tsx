import { useEffect, useState } from 'react';
import {
  StyledAvatar,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledMessage,
  StyledMessageWrapper,
} from './styled';

const MessagePlaceholder = () => {
  const [rows, setRows] = useState<number[]>([]);

  useEffect(() => {
    const row = [...Array(Math.floor(Math.random() * 3) + 1).keys()].map(
      (_) => Math.floor(Math.random() * 50) + 30
    );
    setRows(row);
  }, []);
  return (
    <StyledContainer>
      <StyledAvatar />
      <StyledContent>
        <StyledHeader></StyledHeader>
        <StyledMessageWrapper>
          {rows.map((val, i) => (
            <StyledMessage
              key={i}
              variant="caption"
              length={val}
            ></StyledMessage>
          ))}
        </StyledMessageWrapper>
      </StyledContent>
    </StyledContainer>
  );
};

const MessagesPlaceholder = () => (
  <>
    <MessagePlaceholder />
    <MessagePlaceholder />
    <MessagePlaceholder />
    <MessagePlaceholder />
    <MessagePlaceholder />
    <MessagePlaceholder />
    <MessagePlaceholder />
  </>
);

export default MessagesPlaceholder;
