import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DeleteConnectionFn,
  PostToConnectionFn,
  PostToConnectionsFn,
} from './types';

export const createAPIGatewayClient = (event: APIGatewayProxyEvent) => {
  return new ApiGatewayManagementApiClient({
    endpoint:
      'https://' +
      event.requestContext.domainName +
      '/' +
      event.requestContext.stage,
  });
};

export const postToConnection: PostToConnectionFn = async ({
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
      'Unable to send message to a connection',
      connectionId,
      error
    );
    await deleteConnection({ apiGatewayClient, connectionId });
  }
};

export const postToConnections: PostToConnectionsFn = async ({
  event,
  connections,
  message,
}) => {
  const apiGatewayClient = createAPIGatewayClient(event);
  await Promise.all(
    connections.map(async (connectionId: string) => {
      console.log('Sending message to connection ', connectionId);
      await postToConnection({
        apiGatewayClient,
        connectionId,
        message: JSON.stringify(message),
      });
    })
  );
};

const deleteConnection: DeleteConnectionFn = async ({
  apiGatewayClient,
  connectionId,
}) => {
  try {
    const command = new DeleteConnectionCommand({
      ConnectionId: connectionId,
    });

    await apiGatewayClient.send(command);
  } catch (error) {
    console.warn('Unable to disconnect the broken connection', error);
  }
};
