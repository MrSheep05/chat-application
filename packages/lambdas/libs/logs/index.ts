import { Handler, Context, Callback } from 'aws-lambda';
import { createResponse } from '@chat-lambdas-libs/response';

export const middleware =
    <T>(handler: Handler<T>) =>
    async (event: T, context: Context, callback: Callback) => {
        console.log('Event:', JSON.stringify(event));

        try {
            const response = await handler(event, context, callback);
            console.log('Handler Response:', response);
            return response;
        } catch (error) {
            console.log('Handler Threw Exception:', error);
            return createResponse({ statusCode: 500 });
        }
    };
