import { queryProcedure, getOutput } from "@chat-lambdas-libs/database";
import { Procedure, ProcedureOutput } from "@chat-lambdas-libs/database/types";
import { AddMessageFn, GetConnectionsFn } from "./types";

export const addMessage: AddMessageFn = async ({ userId, content }) => {
  const { result } = await queryProcedure({
    type: Procedure.AddMessage,
    payload: { userId, content },
    outputs: { messageData: "message_data" },
  });

  if (result.type === ProcedureOutput.AddMessage) {
    return JSON.stringify(result.payload);
  }
  throw Error("Unexpected output type from procedure!");
};

export const getConnections: GetConnectionsFn = async (connectionId) => {
  const { result } = await queryProcedure({ type: Procedure.GetConnections });
  console.log("GetConnection result", result);
  return {
    userId: (result.payload as { id: string }[]).find(
      ({ id }) => id === connectionId
    ) as unknown as string, //TODO check type AWS cloud
    connections: result.payload,
  };
};
