import { createResponse } from "@chat-lambdas-libs/response";
import { middleware } from "@chat-lambdas-libs/logs";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { getDataFromEvent } from "./event";
import { getMessages } from "./database";
import {
  createAPIGatewayClient,
  postToConnection,
} from "@chat-lambdas-libs/api-gateway";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const data = getDataFromEvent(event);
    if (!data) return createResponse({ statusCode: 400 });

    const apiGatewayClient = createAPIGatewayClient(event);
    const { oldestMessageId, connectionId } = data;
    try {
      const messages = await getMessages(oldestMessageId);
      await postToConnection({
        apiGatewayClient,
        connectionId,
        message: JSON.stringify({
          action: "getMessages",
          payload: { messages },
        }),
      });
    } catch (error) {
      console.error("Encountered error:", error);
      return createResponse({ statusCode: 500 });
    }

    return createResponse({ statusCode: 200 });
  }
);
