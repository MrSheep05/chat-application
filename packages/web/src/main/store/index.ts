import Store from 'electron-store';

const store = new Store();

export const getFromStore = (key: string) => {
  return store.get(key);
};

export const updateStore = (key: string, value: any) => {
  store.set(key, value);
};
