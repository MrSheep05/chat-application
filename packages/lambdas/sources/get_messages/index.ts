import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { queryProcedure } from "@chat-lambdas-libs/database";

const createAPIGatewayClient = (event) => {
  return new ApiGatewayManagementApiClient({
    endpoint:
      "https://" +
      event.requestContext.domainName +
      "/" +
      event.requestContext.stage,
  });
};

const getMessages = async (oldestMessageId) => {
  const response = await queryProcedure({
    name: "GetMessages",
    params: oldestMessageId ? [oldestMessageId] : [null],
  });

  console.log("response", JSON.stringify(response));

  const [output = []] = response?.results ?? [];

  return output.map(({ message }) => message).reverse();
};

export const handler = async (event) => {
  console.info("Received event", event);

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

  return {
    statusCode: 200,
  };
};
