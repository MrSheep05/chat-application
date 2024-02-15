jest.mock('../../utils/index', () => {
  return {
    request: jest.fn(),
  };
});

import { fireEvent, render, screen } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import Register from '.';
import AppStateComponent from '../../state';
import { request } from '../../utils';

type RegisterElements = {
  [key: string]: HTMLElement;
};

const getRegisterElements = (): RegisterElements => {
  const userInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');
  const confirmInput = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByText('Sign up');
  const navigationButton = screen.getByText('Already have an account?');

  return {
    userInput,
    passwordInput,
    confirmInput,
    submitButton,
    navigationButton,
  };
};

const renderRegister = () => {
  const navigateSpy = jest.fn();

  jest.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateSpy);

  render(
    <AppStateComponent>
      <Register />
    </AppStateComponent>
  );

  return { navigateSpy };
};

jest.mock('react-router-dom');

describe('Given the Register', () => {
  describe('When rendered', () => {
    it('should show title', () => {
      renderRegister();

      expect(screen.getByText('Create an account')).toBeVisible();
    });

    it('should show username input', () => {
      renderRegister();

      const { userInput } = getRegisterElements();

      expect(userInput).toBeVisible();
    });

    it('should show password input', () => {
      renderRegister();

      const { passwordInput } = getRegisterElements();

      expect(passwordInput).toBeVisible();
    });

    it('should show password confirming input', () => {
      renderRegister();

      const { confirmInput } = getRegisterElements();

      expect(confirmInput).toBeVisible();
    });

    it('should show submit button', () => {
      renderRegister();

      const { submitButton } = getRegisterElements();

      expect(submitButton).toBeVisible();
    });

    it('should show navigation button', () => {
      renderRegister();

      const { navigationButton } = getRegisterElements();

      expect(navigationButton).toBeVisible();
    });
  });

  describe('When user attempts to sign up', () => {
    describe('And they provide all required form inputs', () => {
      describe('And both passwords match', () => {
        const fillForm = () => {
          const { confirmInput, userInput, passwordInput, submitButton } =
            getRegisterElements();

          fireEvent.change(passwordInput, { target: { value: 'top-secret' } });
          fireEvent.change(userInput, { target: { value: 'my-username' } });
          fireEvent.change(confirmInput, {
            target: { value: 'top-secret' },
          });
          fireEvent.click(submitButton);
        };

        it('should make a request to log in the user', () => {
          renderRegister();
          fillForm();

          expect(request).toHaveBeenCalledWith({
            body: JSON.stringify({
              username: 'my-username',
              password: 'top-secret',
            }),
            method: 'POST',
            path: '/register',
          });
        });
      });

      describe('And passwords do not match', () => {
        const fillFormWithDifferentPasswords = () => {
          const { confirmInput, userInput, passwordInput, submitButton } =
            getRegisterElements();

          fireEvent.change(passwordInput, { target: { value: 'top-secret' } });
          fireEvent.change(userInput, { target: { value: 'my-username' } });
          fireEvent.change(confirmInput, {
            target: { value: 'top-secret-different' },
          });
          fireEvent.click(submitButton);
        };

        it('should mark confirming password input', () => {
          renderRegister();
          fillFormWithDifferentPasswords();

          const { confirmInput } = getRegisterElements();

          expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
        });

        it('should show error about passwords differance', () => {
          renderRegister();
          fillFormWithDifferentPasswords();

          expect(screen.getByText('Passwords do not match')).toBeVisible();
        });
      });
    });

    describe('And they provide both password and confirming password', () => {
      const submitFormWithoutUsername = () => {
        const { passwordInput, confirmInput, submitButton } =
          getRegisterElements();
        fireEvent.change(passwordInput, { target: { value: 'top-secret' } });
        fireEvent.change(confirmInput, { target: { value: 'top-secret' } });
        fireEvent.click(submitButton);
      };

      it('should mark username input', () => {
        renderRegister();
        submitFormWithoutUsername();

        const { userInput } = getRegisterElements();

        expect(userInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('And they provide nothing', () => {
      const submitEmptyForm = () => {
        const { submitButton } = getRegisterElements();
        fireEvent.click(submitButton);
      };

      it('should mark username input', () => {
        renderRegister();
        submitEmptyForm();

        const { userInput } = getRegisterElements();

        expect(userInput).toHaveAttribute('aria-invalid', 'true');
      });

      it('should mark password input', () => {
        renderRegister();
        submitEmptyForm();

        const { passwordInput } = getRegisterElements();

        expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      });

      it('should mark password confirming input', () => {
        renderRegister();
        submitEmptyForm();

        const { confirmInput } = getRegisterElements();

        expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('When user click log in option', () => {
    it('should navigate user to log in view', () => {
      const { navigateSpy } = renderRegister();
      const { navigationButton } = getRegisterElements();

      fireEvent.click(navigationButton);

      expect(navigateSpy).toHaveBeenCalledWith('/');
    });
  });
});
