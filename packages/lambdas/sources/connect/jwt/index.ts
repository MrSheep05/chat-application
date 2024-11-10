import { GetDataFromEventFn, getTokenSubjectFn } from "./types";

export const getTokenSubject: getTokenSubjectFn = (token) => {
  const [, payload] = token.split(".");
  if (payload) {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).sub;
  }
};

export const getDataFromEvent: GetDataFromEventFn = (event) => {
  const { connectionId } = event.requestContext;
  if (!connectionId || !event.queryStringParameters) return;
  const { token } = event.queryStringParameters;
  if (!token) return;
  return { token, connectionId };
};
