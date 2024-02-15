import { request } from '../../utils';

interface RegisterParams {
  username: string;
  password: string;
}

export const register = async ({ username, password }: RegisterParams) => {
  return await request({
    path: '/register',
    body: JSON.stringify({ username, password }),
    method: 'POST',
  });
};
