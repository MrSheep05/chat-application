import { postToConnections } from '@chat-lambdas-libs/api-gateway';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { getDataFromEvent } from './event';
import { createResponse } from '@chat-lambdas-libs/response';
import { removeMessage } from './database';
import { getConnections } from '@chat-lambdas-libs/database';
import { middleware } from '@chat-lambdas-libs/logs';

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const data = getDataFromEvent(event);

    if (!data) return createResponse({ statusCode: 400 });

    const { messageId, connectionId } = data;

    try {
      const affectedRows = await removeMessage({ connectionId, messageId });
      if (affectedRows < 0) return createResponse({ statusCode: 403 });

      const { connections } = await getConnections();
      await postToConnections({
        event,
        connections,
        message: { action: 'remove', payload: { id: messageId } },
      });
    } catch (error) {
      console.log('Failed to remove the message:', error);

      return createResponse({ statusCode: 500 });
    }
  }
);
