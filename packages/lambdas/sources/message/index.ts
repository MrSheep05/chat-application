import { queryProcedure, getOutput } from "@chat-lambdas-libs/database";
import { createAPIGatewayClient, postToConnection } from "./apiGateway";

const addMessage = async ({ userId, message }) => {
  const response = await queryProcedure({
    name: "AddMessage",
    params: [userId, message],
    outputs: ["message_data"],
  });

  const output = getOutput(response, "@message_data");

  return JSON.parse(output);
};

const getConnections = async () => {
  const {
    results: [connections],
  } = await queryProcedure({ name: "GetConnections" });

  return connections;
};

export const handler = async (event) => {
  const { connectionId } = event.requestContext;
  console.log(`Received a message ${event.body} from ${connectionId}`);

  const apiGatewayClient = createAPIGatewayClient(event);
  const parsedMessage = JSON.parse(event.body);
  const { message } = parsedMessage.payload;

  const connections = await getConnections();
  const { user_id: userId } = connections.find(({ id }) => id === connectionId);
  const addedMessage = await addMessage({ message, userId });
  console.log(addedMessage);

  await Promise.all(
    connections.map(async ({ id: connectionId }) => {
      console.log("Sending message to connection ", connectionId);
      await postToConnection({
        apiGatewayClient,
        connectionId,
        message: JSON.stringify({
          action: "message",
          payload: addedMessage,
        }),
      });
    })
  );

  return {
    statusCode: 200,
  };
};
