import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

export interface ITemplates {
  [code: number]: string;
}

export type CreateBodyFn = (
  statusCode: number,
  message?: string | object
) => string | undefined;

interface ICreateResponseParams {
  statusCode?: number;
  message?: string | object;
}

export type CreateResponseFn = ({
  statusCode,
  message,
}: ICreateResponseParams) => {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body?: string;
};

export type PostToConnectionFn = ({
  connectionId,
  message,
  apiGatewayClient,
}: {
  connectionId: string;
  message: string;
  apiGatewayClient: ApiGatewayManagementApiClient;
}) => void;

export type DeleteConnectionFn = ({
  connectionId,
  apiGatewayClient,
}: {
  connectionId: string;
  apiGatewayClient: ApiGatewayManagementApiClient;
}) => void;

interface IPostToConnectionsParams {
  event: APIGatewayProxyEvent;
  connections: string[];
  message: object;
}

export type PostToConnectionsFn = ({
  event,
  connections,
  message,
}: IPostToConnectionsParams) => Promise<void>;
