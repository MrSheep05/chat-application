import { queryProcedure } from '@chat-lambdas-libs/database';
import { Procedure, ProcedureOutput } from '@chat-lambdas-libs/database/types';
import { GetMessagesFn } from './types';

export const getMessages: GetMessagesFn = async (oldestMessageId) => {
    const { result } = await queryProcedure({
        type: Procedure.GetMessages,
        payload: { messageId: oldestMessageId ?? null },
    });

    if (ProcedureOutput.GetMessages === result.type) {
        const { payload } = result;
        return payload.reverse();
    }
    console.error('Unexpected response from database:', result);
    throw new Error('Incorrect response from the Database');
};
