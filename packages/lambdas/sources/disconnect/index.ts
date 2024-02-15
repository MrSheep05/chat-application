import { queryProcedure } from "@chat-lambdas-libs/database";

const removeConnectionId = async (connectionId) => {
  return await queryProcedure({
    name: "RemoveConnection",
    params: [connectionId],
  });
};

export const handler = async (event) => {
  const { connectionId } = event.requestContext;

  try {
    await removeConnectionId(connectionId);
  } catch (error) {
    console.error("Encountered error:", error);
    return { statusCode: 500 };
  }

  return {
    statusCode: 200,
  };
};
