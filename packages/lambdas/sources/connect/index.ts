import { Handler } from "aws-lambda";
import { queryProcedure } from "@chat-lambdas-libs/database";

const addConnectionId = async ({
  userId,
  connectionId,
}: {
  userId: string;
  connectionId: string;
}) => {
  return await queryProcedure({
    name: "AddConnection",
    params: [userId, connectionId],
  });
};

const getTokenSubject = (token: string) => {
  const [, payload] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString()).sub;
};

export const handler: Handler = async (event, _context, callback) => {
  console.info("event:", event);

  const { connectionId } = event.requestContext;
  const { token } = event.queryStringParameters;
  const userId = getTokenSubject(token);

  try {
    await addConnectionId({ connectionId, userId });
    callback(null, { statusCode: 200 });
  } catch (error) {
    console.error("Encountered error:", error);
    callback(null, { statusCode: 500 });
  }
};
