import { queryProcedure } from '@chat-lambdas-libs/database';
import { RemoveMessageFn } from './types';
import { Procedure, ProcedureOutput } from '@chat-lambdas-libs/database/types';

export const removeMessage: RemoveMessageFn = async ({
  connectionId,
  messageId,
}) => {
  const { result } = await queryProcedure({
    type: Procedure.RemoveMessage,
    payload: { messageId, connectionId },
  });

  if (
    result.type === ProcedureOutput.RemoveMessage &&
    result.payload.length > 0
  ) {
    return result.payload[0].updateCount;
  }
  throw Error('Unexpected output type from procedure!');
};
