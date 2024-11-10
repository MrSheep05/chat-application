import { APIGatewayProxyEvent } from 'aws-lambda';

export type GetDataFromEventFn = (event: APIGatewayProxyEvent) => {
  token?: string;
  refreshToken?: string;
};
