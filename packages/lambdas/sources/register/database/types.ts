import { ProcedureResponse } from "@chat-lambdas-libs/database/types";

export type RegisterUserFn = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => Promise<ProcedureResponse>;
