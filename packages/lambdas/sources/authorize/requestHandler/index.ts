import { generateAllow, generateDeny } from "../policy";
import { GetMethodArnFn, RequestHandlerFn } from "./types";

const getMethodArn: GetMethodArnFn = (event) => {
  const { methodArn } = event;

  return methodArn;
};

export const allowRequest: RequestHandlerFn = (event, callback) => {
  return callback(null, generateAllow(getMethodArn(event)));
};

export const denyRequest: RequestHandlerFn = (event, callback) => {
  return callback(null, generateDeny(getMethodArn(event)));
};
