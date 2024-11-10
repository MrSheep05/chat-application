import { queryProcedure } from '@chat-lambdas-libs/database';
import { Procedure, ProcedureOutput } from '@chat-lambdas-libs/database/types';
import { GetUserDataFn } from './types';

export const getUserData: GetUserDataFn = async (connectionId: string) => {
  const { result } = await queryProcedure({
    type: Procedure.GetUserData,
    payload: { connectionId },
  });

  const [{ id, username }] =
    result.type === ProcedureOutput.GetUserData
      ? result.payload
      : [undefined as any];

  if (!id || !username) {
    console.error('Unexpected response from database:', id, username);
    throw new Error('Incorrect response from the Database');
  }

  return { id, username };
};
