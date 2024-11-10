import { verify } from '@chat-lambdas-libs/kms';
import { APIGatewayRequestAuthorizerEvent, Handler } from 'aws-lambda';
import { allowRequest, denyRequest } from './requestHandler';

export const handler: Handler<APIGatewayRequestAuthorizerEvent> = async (
  event,
  _context,
  callback
) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!process?.env?.kmsJwtAliasName) {
    console.log('Environment variables are not set');
    return denyRequest(event, callback);
  }

  const { token } = event?.queryStringParameters ?? {};

  if (!token) {
    console.log('Invalid request', token);
    return denyRequest(event, callback);
  }

  const { isValid, error } = await verify(token, process.env.kmsJwtAliasName);

  if (error) {
    console.log('Invalid token:', error);
    return denyRequest(event, callback);
  }

  return allowRequest(event, callback);
};
