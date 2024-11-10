import { GetDataFromEventFn } from "./types";

export const getDataFromEvent: GetDataFromEventFn = (event) => {
  const { connectionId } = event.requestContext;
  if (!connectionId || !event.body) return;
  const { id } = JSON.parse(event.body).payload;
  if (!id) return;
  return { messageId: id, connectionId };
};
