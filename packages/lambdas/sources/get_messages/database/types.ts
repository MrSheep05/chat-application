import { MessageBody } from '@chat-lambdas-libs/database/types';

export type GetMessagesFn = (
    offsetMessageId?: string,
) => Promise<MessageBody[]>;
