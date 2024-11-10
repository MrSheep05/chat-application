import { postToConnections } from "@chat-lambdas-libs/api-gateway";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { createResponse } from "@chat-lambdas-libs/response";
import { addMessage } from "./database";
import { getDataFromEvent } from "./event";
import { getConnections } from "@chat-lambdas-libs/database";
import { middleware } from "@chat-lambdas-libs/logs";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const data = getDataFromEvent(event);
    if (!data) return createResponse({ statusCode: 400 });

    const { connectionId, message: content } = data;
    try {
      const { connections, userId } = await getConnections(connectionId);
      if (!userId) return createResponse({ statusCode: 400 });

      const addedMessage = await addMessage({ content, userId });
      await postToConnections({
        connections: connections,
        event,
        message: {
          action: "message",
          payload: addedMessage,
        },
      });

      return createResponse({ statusCode: 200 });
    } catch (error) {
      console.error("Encountered an error", error);
      return createResponse({ statusCode: 500 });
    }
  },
);
