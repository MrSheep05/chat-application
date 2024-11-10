import { APIGatewayProxyEvent } from 'aws-lambda';

export type GetDataFromEventFn = (
    event: APIGatewayProxyEvent,
) => { messageId: string; connectionId: string } | undefined;
