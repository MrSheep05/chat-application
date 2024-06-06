import { GetDataFromEventFn } from "./types";

export const getDataFromEvent: GetDataFromEventFn = (event) => {
  try {
    const { connectionId } = event.requestContext;
    if (!event.body || !connectionId) return;
    console.info("getDataFromEvent");
    const { oldestMessageId } = JSON.parse(event.body).payload;
    return { oldestMessageId: oldestMessageId ?? null, connectionId };
  } catch (e) {
    console.error(e);
  }
};
