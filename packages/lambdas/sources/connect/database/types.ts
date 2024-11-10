import { ProcedureResponse } from '@chat-lambdas-libs/database/types';

export type AddConnectionFn = ({
  userId,
  connectionId,
}: {
  userId: string;
  connectionId: string;
}) => Promise<ProcedureResponse>;
