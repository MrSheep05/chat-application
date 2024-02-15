import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InputErrors } from './types';
import {
  StyledContainer,
  StyledHeading,
  StyledInput,
  StyledButton,
} from './styled';
import { register } from './api';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [errors, setErrors] = useState<InputErrors>({
    username: false,
    password: false,
    checkPassword: false,
  });
  const navigate = useNavigate();

  const registerUser = async () => {
    const isUsernameInvalid = username === '';
    const isPasswordInvalid = password === '';
    const isCheckPasswordInvalid =
      checkPassword === '' || checkPassword !== password;

    setErrors({
      username: isUsernameInvalid,
      password: isPasswordInvalid,
      checkPassword: isCheckPasswordInvalid,
    });

    if (isUsernameInvalid || isPasswordInvalid || isCheckPasswordInvalid) {
      return;
    }

    try {
      const response = await register({ username, password });
      alert(response);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <StyledContainer
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          registerUser();
        }
      }}
      variant="outlined"
    >
      <StyledHeading variant="h4">Create an account</StyledHeading>
      <StyledInput
        error={errors.username}
        label="Username"
        variant="filled"
        value={username}
        onChange={({ target }) => {
          setUsername(target.value);
          setErrors({ ...errors, username: false });
        }}
      />
      <StyledInput
        error={errors.password}
        label="Password"
        variant="filled"
        value={password}
        type="password"
        onChange={({ target }) => {
          setPassword(target.value);
          setErrors({ ...errors, password: false });
        }}
      />
      <StyledInput
        error={errors.checkPassword}
        label="Confirm Password"
        variant="filled"
        value={checkPassword}
        type="password"
        onChange={({ target }) => {
          setCheckPassword(target.value);
          setErrors({ ...errors, checkPassword: false });
        }}
        helperText={
          errors.checkPassword && !errors.password && checkPassword !== ''
            ? 'Passwords do not match'
            : undefined
        }
      />
      <StyledButton onClick={registerUser} variant="outlined">
        Sign up
      </StyledButton>
      <StyledButton onClick={() => navigate('/')} variant="text">
        Already have an account?
      </StyledButton>
    </StyledContainer>
  );
};

export default Register;
