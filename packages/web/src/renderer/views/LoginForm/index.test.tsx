import { render, screen, fireEvent } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import LoginForm from '.';
import { AppState } from '../../state';

jest.mock('react-router-dom');

const mockedToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSTkFNRSJ9.C7mKp_BtLkcfTkkVGd5s_BXPpTN1iqRO6qagebK8Hek';

const wait = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));

const jsonResponse = jest
  .fn()
  .mockResolvedValue({ token: mockedToken, refreshToken: mockedToken });

global.fetch = jest.fn().mockResolvedValue({
  json: jsonResponse,
  ok: true,
});

type LoginFormElements = {
  userInput: HTMLElement;
  passwordInput: HTMLElement;
  submitButton: HTMLElement;
  navigateButton: HTMLElement;
};

const getLoginFormElements = (): LoginFormElements => {
  const userInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByText('Sign in');
  const navigateButton = screen.getByText('Need an account?');

  return { userInput, passwordInput, submitButton, navigateButton };
};

const renderLoginForm = () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  jest.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateSpy);

  render(
    <AppState.Provider
      value={{
        state: {
          messages: [],
          message: '',
        },
        dispatch: dispatchSpy,
      }}
    >
      <LoginForm />
    </AppState.Provider>
  );

  return { navigateSpy, dispatchSpy };
};

describe('Given the LoginForm', () => {
  describe('When rendered', () => {
    it('should show title', () => {
      renderLoginForm();

      expect(screen.getByText('Join to chat')).toBeVisible();
    });

    it('should show username input', () => {
      renderLoginForm();

      expect(screen.getByLabelText('Username')).toBeVisible();
    });

    it('should show password input', () => {
      renderLoginForm();

      expect(screen.getByLabelText('Password')).toBeVisible();
    });

    it('should show submit button', () => {
      renderLoginForm();

      expect(screen.getByText('Sign in')).toBeVisible();
    });

    it('should show register option', () => {
      renderLoginForm();

      expect(screen.getByText('Need an account?')).toBeVisible();
    });
  });

  describe('When user attempts to login', () => {
    describe('And they provide both username and password', () => {
      const submitValidCredentials = () => {
        const { userInput, passwordInput, submitButton } =
          getLoginFormElements();

        fireEvent.change(userInput, { target: { value: 'username' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);
      };

      it('should fire a dispatch actions tokensReceived', async () => {
        const { dispatchSpy } = renderLoginForm();

        submitValidCredentials();

        await wait();

        expect(dispatchSpy).toHaveBeenCalledWith({
          payload: {
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSTkFNRSJ9.C7mKp_BtLkcfTkkVGd5s_BXPpTN1iqRO6qagebK8Hek',
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSTkFNRSJ9.C7mKp_BtLkcfTkkVGd5s_BXPpTN1iqRO6qagebK8Hek',
          },
          type: 'tokensReceived',
        });
      });
    });

    describe('And they provide only username', () => {
      const submitUsernameOnly = () => {
        const { userInput, submitButton } = getLoginFormElements();

        fireEvent.change(userInput, { target: { value: 'my-username' } });
        fireEvent.click(submitButton);
      };

      it('should mark the password', () => {
        renderLoginForm();

        const { passwordInput } = getLoginFormElements();

        submitUsernameOnly();

        expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      });

      it('should not save username to state', () => {
        const { dispatchSpy } = renderLoginForm();

        submitUsernameOnly();

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('And they provide only password', () => {
      const submitPasswordOnly = () => {
        const { passwordInput, submitButton } = getLoginFormElements();

        fireEvent.change(passwordInput, { target: { value: 'my-password' } });
        fireEvent.click(submitButton);
      };

      it('should mark the username', () => {
        renderLoginForm();

        const { userInput } = getLoginFormElements();

        submitPasswordOnly();

        expect(userInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('And they provide nothing', () => {
      it('should mark the username', () => {
        renderLoginForm();

        const { userInput, submitButton } = getLoginFormElements();

        fireEvent.click(submitButton);

        expect(userInput).toHaveAttribute('aria-invalid', 'true');
      });

      it('should mark the password', () => {
        renderLoginForm();

        const { passwordInput, submitButton } = getLoginFormElements();

        fireEvent.click(submitButton);

        expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('When user clicks register option', () => {
    it('should navigate user to register view', () => {
      const { navigateSpy } = renderLoginForm();
      const { navigateButton } = getLoginFormElements();

      fireEvent.click(navigateButton);

      expect(navigateSpy).toHaveBeenCalledWith('/register');
    });
  });
});
