import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { queryProcedure } from "@chat-lambdas-libs/database";
import { Procedure, ProcedureOutput } from "@chat-lambdas-libs/database/types";
import { createResponse } from "@chat-lambdas-libs/response";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";

const createAPIGatewayClient = (event: APIGatewayProxyEvent) => {
  return new ApiGatewayManagementApiClient({
    endpoint:
      "https://" +
      event.requestContext.domainName +
      "/" +
      event.requestContext.stage,
  });
};

const getMessages = async (oldestMessageId?: string) => {
  const response = await queryProcedure({
    type: Procedure.GetMessages,
    payload: { messageId: oldestMessageId ?? null },
  });

  console.log("response", JSON.stringify(response));
  if (ProcedureOutput.Other == response.result.type) {
    const [output = []] = response.result.payload ?? [];

    return output.map(({ message }: any) => message).reverse();
  }
};

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  try {
    console.info("Received event", event);
    if (!event.body) return;
    const { oldestMessageId } = JSON.parse(event.body).payload;
    const apiGatewayClient = createAPIGatewayClient(event);
    const messages = await getMessages(oldestMessageId);

    console.log(messages);

    const command = new PostToConnectionCommand({
      ConnectionId: event.requestContext.connectionId,
      Data: JSON.stringify({
        action: "getMessages",
        payload: { messages },
      }),
    });

    await apiGatewayClient.send(command);

    return createResponse({ statusCode: 200 });
  } catch (e) {
    return createResponse({ statusCode: 500 });
  }
};
