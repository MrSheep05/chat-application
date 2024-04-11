import type { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { createResponse } from "@chat-lambdas-libs/response";

import { GetDataFromEventFn } from "./types";
import { createKeyPair, verifyTokens } from "./jwt";

const UNAUTHORISED_RESPONSE = createResponse({ statusCode: 401 });
const { kmsJwtAliasName, kmsRefreshJwtAliasName } = process.env;

const getDataFromEvent: GetDataFromEventFn = (event) => {
  try {
    if (event.body) {
      return JSON.parse(event.body);
    }
  } catch (error) {
    console.error("Failed to parse the tokens:", error);
  }

  return {};
};

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  console.log("Received request:", event);
  if (!kmsJwtAliasName || !kmsRefreshJwtAliasName) {
    return createResponse({ statusCode: 500 });
  }

  const { token, refreshToken } = getDataFromEvent(event);

  if (!token || !refreshToken) {
    return createResponse({ statusCode: 400 });
  }

  try {
    await verifyTokens(token, refreshToken);
  } catch (error) {
    console.error("Verify Tokens Error:", error);
    return UNAUTHORISED_RESPONSE;
  }

  try {
    const { token: newToken, refreshToken: newRefreshToken } =
      await createKeyPair(token);

    return createResponse({
      message: JSON.stringify({
        token: newToken,
        refreshToken: newRefreshToken,
      }),
      statusCode: 200,
    });
  } catch (error) {
    return createResponse({ statusCode: 500 });
  }
};
