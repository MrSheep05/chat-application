import { queryProcedure, getOutput } from "@chat-lambdas-libs/database";
import { postToConnections } from "@chat-lambdas-libs/api-gateway";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { createResponse } from "@chat-lambdas-libs/response";
import { Procedure } from "@chat-lambdas-libs/database/types";
import { addMessage, getConnections } from "./database";

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  try {
    console.log("Received event", event);

    if (!event.body) {
      console.log("Body is in invalid format:", event.body);
      throw new Error("Invalid body");
    }

    const { payload } = JSON.parse(event.body);
    const { message: content } = payload;

    const { connectionId } = event.requestContext;
    const { connections, userId } = await getConnections(connectionId);

    if (!userId) {
      console.error("No user match connection", userId);
      throw new Error("No user matches connection");
    }

    const addedMessage = await addMessage({ content, userId });
    await postToConnections({
      connections: connections.map(({ id }) => id),
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
};
