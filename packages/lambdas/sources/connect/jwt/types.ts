import { APIGatewayProxyEvent } from 'aws-lambda';

export type GetDataFromEventFn = (event: APIGatewayProxyEvent) =>
    | {
          token: string;
          connectionId: string;
      }
    | undefined;
export type getTokenSubjectFn = (token: string) => string | undefined;
