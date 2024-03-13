import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { queryProcedure } from "@chat-lambdas-libs/database";
import { Procedure } from "@chat-lambdas-libs/database/types";

const addConnectionId = async ({
  userId,
  connectionId,
}: {
  userId: string;
  connectionId: string;
}) => {
  return await queryProcedure({
    type: Procedure.AddConnection,
    payload: { userId, connectionId },
  });
};

const getTokenSubject = (token: string) => {
  const [, payload] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString()).sub;
};

export const handler: Handler<APIGatewayProxyEvent> = async (
  event,
  _context,
  callback
) => {
  console.info("event:", event);

  const { connectionId } = event.requestContext;
  if (!connectionId)
    throw Error("Did not find connectionId inside requestContext!");

  if (!event.queryStringParameters)
    throw Error("No query parameters provided!");
  const { token } = event.queryStringParameters;
  if (!token) throw Error("Did not find token inside query params!");
  const userId = getTokenSubject(token);

  try {
    await addConnectionId({ connectionId, userId });
    callback(null, { statusCode: 200 });
  } catch (error) {
    console.error("Encountered error:", error);
    callback(null, { statusCode: 500 });
  }
};
