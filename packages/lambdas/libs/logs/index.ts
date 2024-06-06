import { APIGatewayProxyEvent, Handler, Context, Callback } from "aws-lambda";

export const middleware =
  (handler: Handler<APIGatewayProxyEvent>) =>
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    console.log("Event:", event);

    const response = await handler(event, context, callback);

    console.log("Handler Response:", response);

    return response;
  };
