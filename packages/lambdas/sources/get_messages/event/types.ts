import { APIGatewayProxyEvent } from 'aws-lambda';

export type GetDataFromEventFn = (
  event: APIGatewayProxyEvent
) => { connectionId: string; oldestMessageId: string } | undefined;
