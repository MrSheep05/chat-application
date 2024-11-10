import { queryProcedure } from '@chat-lambdas-libs/database';
import { Procedure } from '@chat-lambdas-libs/database/types';
import { RemoveConnectionFn } from './types';

export const removeConnectionId: RemoveConnectionFn = async (connectionId) => {
    return await queryProcedure({
        type: Procedure.RemoveConnection,
        payload: { connectionId },
    });
};
