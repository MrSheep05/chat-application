export const getTokens = () => {
  const { store } = window.electron;

  const token = store.get('token');
  const refreshToken = store.get('refreshToken');

  if (typeof token === 'string' && typeof refreshToken === 'string') {
    return { token, refreshToken };
  }

  return { token: '', refreshToken: '' };
};

interface StoreTokensProps {
  token: string;
  refreshToken: string;
}

export const storeTokens = ({ token, refreshToken }: StoreTokensProps) => {
  const { store } = window.electron;

  store.set('token', token);
  store.set('refreshToken', refreshToken);
};
