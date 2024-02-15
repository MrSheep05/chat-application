import { LoginResponse } from './types';
import { request } from '../../utils';

interface LoginParams {
  username: string;
  password: string;
}

export const login = async ({ username, password }: LoginParams) => {
  return (await request({
    path: '/login',
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })) as LoginResponse;
};
