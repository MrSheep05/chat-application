import { GetDataFromEventFn } from './types';

export const getDataFromEvent: GetDataFromEventFn = (event) => {
  const { connectionId } = event.requestContext;
  if (!event.body || !connectionId) return;
  const { oldestMessageId } = JSON.parse(event.body).payload;
  return { oldestMessageId: oldestMessageId ?? null, connectionId };
};
