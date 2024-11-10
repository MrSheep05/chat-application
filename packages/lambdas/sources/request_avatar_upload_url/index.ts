import { middleware } from '@chat-lambdas-libs/logs';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { getUserData } from './database';
import { createResponse } from '@chat-lambdas-libs/response';
import { createPresignedUrl } from '@chat-lambdas-libs/s3';
import {
    createAPIGatewayClient,
    postToConnection,
} from '@chat-lambdas-libs/api-gateway';

export const handler: Handler<APIGatewayProxyEvent> = middleware(
    async (event) => {
        console.info('Message', event.body);

        const { connectionId } = event.requestContext;
        const { bucketName } = process.env;

        console.info(
            'Varaibs BucketName:',
            bucketName,
            'ConnectionID',
            connectionId,
        );

        if (!bucketName || !connectionId) {
            return createResponse({ statusCode: 500 });
        }
        const apiGatewayClient = createAPIGatewayClient(event);

        const userData = await getUserData(connectionId);

        console.info('USERDATA ', userData);

        const { id } = userData;
        const path = `uploads/${id}/avatar.png`;

        const presignedUrl = await createPresignedUrl({
            bucket: bucketName,
            path,
        });

        await postToConnection({
            connectionId,
            apiGatewayClient: apiGatewayClient,
            message: JSON.stringify({
                action: 'requestAvatarUploadUrl',
                payload: { url: presignedUrl },
            }),
        });

        return createResponse({
            statusCode: 200,
        });
    },
);
