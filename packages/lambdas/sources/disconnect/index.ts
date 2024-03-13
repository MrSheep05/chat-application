import { queryProcedure } from "@chat-lambdas-libs/database";
import { Procedure } from "@chat-lambdas-libs/database/types";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";

const removeConnectionId = async (connectionId: string) => {
  return await queryProcedure({
    type: Procedure.RemoveConnection,
    payload: { connectionId },
  });
};

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  const { connectionId } = event.requestContext;

  try {
    if (!connectionId)
      throw Error("Did not find connectionId inside requestContext!");
    await removeConnectionId(connectionId);
  } catch (error) {
    console.error("Encountered error:", error);
    return { statusCode: 500 };
  }

  return {
    statusCode: 200,
  };
};
