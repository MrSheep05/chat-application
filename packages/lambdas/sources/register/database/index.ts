import { queryProcedure } from '@chat-lambdas-libs/database';
import { RegisterUserFn } from './types';
import { Procedure } from '@chat-lambdas-libs/database/types';

export const registerUser: RegisterUserFn = async ({ username, password }) => {
  return queryProcedure({
    type: Procedure.RegisterUser,
    payload: { username, password },
  });
};
