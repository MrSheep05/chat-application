import { useContext, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StyledContainer,
  StyledHeading,
  StyledInput,
  StyledButton,
} from './styled';
import { InputErrors } from './types';
import { login } from './api';

import { AppState, Actions } from '../../state';

const LoginForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppState);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<InputErrors>({
    username: false,
    password: false,
  });

  const onUsernameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUsername(event.target.value);
    setError({ username: false, password: error.password });
  };

  const onPasswordChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(event.target.value);
    setError({ username: error.username, password: false });
  };

  const onNeedAccountClick = () => {
    navigate('/register');
  };

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !disabled) {
      await onSubmit();
    }
  };

  const onSubmit = async () => {
    const isUsernameInvalid = username === '';
    const isPasswordInvalid = password === '';

    setError({
      username: isUsernameInvalid,
      password: isPasswordInvalid,
    });

    if (isUsernameInvalid || isPasswordInvalid) {
      return;
    }

    try {
      setDisabled(true);

      const response = await login({ username, password });

      dispatch({ type: Actions.tokensReceived, payload: response });
      navigate('/');
    } catch (thrownError) {
      alert(thrownError);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <StyledContainer onKeyDown={onKeyDown} variant="outlined">
      <StyledHeading variant="h4">Join to chat</StyledHeading>
      <StyledInput
        variant="filled"
        value={username}
        onChange={onUsernameChange}
        label="Username"
        error={error.username}
      />
      <StyledInput
        variant="filled"
        value={password}
        onChange={onPasswordChange}
        type="password"
        label="Password"
        error={error.password}
      />
      <StyledButton variant="outlined" onClick={onSubmit} disabled={disabled}>
        Sign in
      </StyledButton>
      <StyledButton
        disabled={disabled}
        onClick={onNeedAccountClick}
        variant="text"
      >
        Need an account?
      </StyledButton>
    </StyledContainer>
  );
};

export default LoginForm;
