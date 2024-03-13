import { APIGatewayRequestAuthorizerEvent, Callback } from "aws-lambda";

export type RequestHandlerFn = (
  event: APIGatewayRequestAuthorizerEvent,
  callback: Callback<any>
) => void;

export type GetMethodArnFn = (
  event: APIGatewayRequestAuthorizerEvent
) => string;
