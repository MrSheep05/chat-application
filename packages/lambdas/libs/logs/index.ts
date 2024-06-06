import { APIGatewayProxyEvent, Handler, Context, Callback } from "aws-lambda";
import { createResponse } from "@chat-lambdas-libs/response";

export const middleware =
  (handler: Handler<APIGatewayProxyEvent>) =>
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    console.log("Event:", event);

    try {
      const response = await handler(event, context, callback);
      console.log("Handler Response:", response);
      return response;
    } catch (error) {
      console.log("Handler Threw Exception:", error);
      return createResponse({ statusCode: 500 });
    }
  };
