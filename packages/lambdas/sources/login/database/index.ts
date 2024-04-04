import { queryProcedure } from "@chat-lambdas-libs/database";
import { Procedure, ProcedureOutput } from "@chat-lambdas-libs/database/types";
import { GetUserDataFn } from "./types";

export const getUserData: GetUserDataFn = async (username) => {
  const userData = "userData";
  const { result } = await queryProcedure({
    type: Procedure.GetUserData,
    payload: { username },
  });

  const [{ id, password }] =
    result.type === ProcedureOutput.GetUserData
      ? result.payload
      : [undefined as any];

  if (!id || !password) {
    console.error("Unexpected response from database:", id, password);
    throw new Error("Incorrect response from the Database");
  }

  return { id, password };
};
