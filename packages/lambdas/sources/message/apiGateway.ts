import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

export const createAPIGatewayClient = (event) => {
  return new ApiGatewayManagementApiClient({
    endpoint:
      "https://" +
      event.requestContext.domainName +
      "/" +
      event.requestContext.stage,
  });
};

export const postToConnection = async ({
  connectionId,
  message,
  apiGatewayClient,
}) => {
  try {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: message,
    });

    await apiGatewayClient.send(command);
  } catch (error) {
    console.error(
      "Unable to send message to a connection",
      connectionId,
      error
    );
    await deleteConnection({ apiGatewayClient, connectionId });
  }
};

const deleteConnection = async ({ apiGatewayClient, connectionId }) => {
  try {
    const command = new DeleteConnectionCommand({
      ConnectionId: connectionId,
    });

    await apiGatewayClient.send(command);
  } catch (error) {
    console.warn("Unable to disconnect the broken connection", error);
  }
};
