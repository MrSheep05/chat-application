import { MessageBody } from '@chat-lambdas-libs/database/types';

interface IAddMessageParams {
    userId: string;
    content: string;
}

export type AddMessageFn = (params: IAddMessageParams) => Promise<MessageBody>;
