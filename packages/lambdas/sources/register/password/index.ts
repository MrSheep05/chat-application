import { createHmac } from 'crypto';
import { HashPasswordFn } from './types';

export const hashPassword: HashPasswordFn = (password) => {
  if (!process.env.salt) return;
  const hasher = createHmac('sha256', process.env.salt);
  hasher.update(password);
  return hasher.digest('base64');
};
