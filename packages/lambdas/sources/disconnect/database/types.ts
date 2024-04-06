import { ProcedureResponse } from "@chat-lambdas-libs/database/types";

export type RemoveConnectionFn = (
  connectionId: string
) => Promise<ProcedureResponse>;
