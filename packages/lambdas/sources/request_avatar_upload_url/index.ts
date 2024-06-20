import { middleware } from "@chat-lambdas-libs/logs";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    console.info("Message", event.body);
  }
);
