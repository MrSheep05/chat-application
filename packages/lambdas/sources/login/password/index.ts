import { createHmac } from 'crypto';
import type { HashFn } from './types';

export const hash: HashFn = (password) => {
  if (typeof process?.env?.salt !== 'string') {
    throw new Error('Salt is not available');
  }

  const hasher = createHmac('sha256', process.env.salt);

  hasher.update(password);

  return hasher.digest('base64');
};
