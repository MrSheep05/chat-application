import { queryProcedure } from "@chat-lambdas-libs/database";
import { Procedure } from "@chat-lambdas-libs/database/types";
import { AddConnectionFn } from "./types";

export const addConnectionId: AddConnectionFn = async ({
  userId,
  connectionId,
}) => {
  return await queryProcedure({
    type: Procedure.AddConnection,
    payload: { userId, connectionId },
  });
};
