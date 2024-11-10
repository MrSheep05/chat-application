import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { removeConnectionId } from './database';
import { createResponse } from '@chat-lambdas-libs/response';
import { middleware } from '@chat-lambdas-libs/logs';

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const { connectionId } = event.requestContext;

    if (!connectionId) return createResponse({ statusCode: 400 });
    await removeConnectionId(connectionId);
  }
);
