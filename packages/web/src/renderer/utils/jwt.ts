import { UserData } from 'renderer/state';

export const getUserData = (token: string): UserData => {
  const [, payload] = token.split('.');
  const { sub: userId, username } = JSON.parse(window.atob(payload));

  return { userId, username };
};
