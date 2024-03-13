import {
  createAPIGatewayClient,
  postToConnection,
} from "@chat-lambdas-libs/api-gateway";
import { getOutput, queryProcedure } from "@chat-lambdas-libs/database";

const removeMessage = async ({ connectionId, messageId }) => {
  const response = await queryProcedure({
    name: "RemoveMessage",
    params: [connectionId, messageId],
    outputs: ["update_count"],
  });

  const output = getOutput(response, "@update_count");

  if (output !== 1) {
    throw new Error("None of the rows were updated");
  }
};

const getConnections = async () => {
  const {
    results: [connections],
  } = await queryProcedure({ name: "GetConnections" });

  return connections;
};

const updateConnections = async ({ message, apiGatewayClient }) => {
  const connections = await getConnections();
  const promises = connections.map(({ id: connectionId }) => {
    console.log("Sending message to connection ", connectionId);

    return postToConnection({ connectionId, apiGatewayClient, message });
  });

  await Promise.all(promises);
};

export const handler = async (event) => {
  console.info("Event:", event);
  const { connectionId } = event.requestContext;
  const { id } = JSON.parse(event.body).payload;
  const apiGatewayClient = createAPIGatewayClient(event);

  try {
    await removeMessage({ connectionId, messageId: id });
  } catch (error) {
    console.log("Failed to remove the message:", error);
    return { statusCode: 403 };
  }

  try {
    await updateConnections({
      message: event.body,
      apiGatewayClient,
    });

    return { statusCode: 200 };
  } catch (error) {
    console.log("Failed to update the connections:", error);
    return { statusCode: 500 };
  }
};
