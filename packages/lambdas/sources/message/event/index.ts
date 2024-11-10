import { GetDataFromEventFn } from './types';

export const getDataFromEvent: GetDataFromEventFn = (event) => {
  const { connectionId } = event.requestContext;
  if (!connectionId || !event.body) return;
  const { message } = JSON.parse(event.body).payload;
  if (!message) return;
  return { message, connectionId };
};
