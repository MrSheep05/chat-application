import { MessageInputProps } from './types';
import { StyledContainer, StyledForm, StyledInput } from './styled';

const MessageInput = ({ onSubmit, value, onChange }: MessageInputProps) => {
  const subject = '@general'; // TODO: Determine based on the current room
  const placeholder = `Message ${subject}`;

  return (
    <StyledContainer>
      <StyledForm onSubmit={onSubmit}>
        <StyledInput
          value={value}
          onChange={({ target }) => {
            onChange(target.value);
          }}
          placeholder={placeholder}
          disableUnderline={true}
        />
      </StyledForm>
    </StyledContainer>
  );
};

export default MessageInput;
