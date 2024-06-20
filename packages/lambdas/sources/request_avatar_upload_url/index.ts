import { middleware } from "@chat-lambdas-libs/logs";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { getUserData } from "./database";
import { createResponse } from "@chat-lambdas-libs/response";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    console.info("Message", event.body);
    const { connectionId } = event.requestContext;
    if (!connectionId) return createResponse({ statusCode: 500 });
    const userData = await getUserData(connectionId);
    console.info("USERDATA ", userData);
  }
);
