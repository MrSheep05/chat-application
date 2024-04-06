import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { getDataFromEvent, getTokenSubject } from "./jwt";
import { addConnectionId } from "./database";
import { createResponse } from "@chat-lambdas-libs/response";

export const handler: Handler<APIGatewayProxyEvent> = async (
  event,
  _context,
  callback
) => {
  console.info("event:", event);

  const data = getDataFromEvent(event);
  if (!data) return createResponse({ statusCode: 400 });

  const { token, connectionId } = data;
  const userId = getTokenSubject(token);
  if (!userId) return createResponse({ statusCode: 400 });

  try {
    await addConnectionId({ connectionId, userId });
    return createResponse({ statusCode: 200 });
  } catch (error) {
    console.error("Encountered error:", error);
    return createResponse({ statusCode: 500 });
  }
};
