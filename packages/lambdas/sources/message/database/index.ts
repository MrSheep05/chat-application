import { queryProcedure } from '@chat-lambdas-libs/database';
import { Procedure, ProcedureOutput } from '@chat-lambdas-libs/database/types';
import { AddMessageFn } from './types';

export const addMessage: AddMessageFn = async ({ userId, content }) => {
  const { result } = await queryProcedure({
    type: Procedure.AddMessage,
    payload: { userId, content },
  });
  console.log('AddMESSAGE RESULT', result);
  if (result.type === ProcedureOutput.AddMessage && result.payload.length > 0) {
    return result.payload[0];
  }
  throw Error('Unexpected output type from procedure!');
};
