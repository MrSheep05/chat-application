import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { ICreatePresignedUrlParams } from './types';

export const createPresignedUrl = async ({
    bucket,
    path,
    expirationTime = 3600,
    metadata = {},
    region = 'eu-west-2',
}: ICreatePresignedUrlParams): Promise<string> => {
    const client = new S3Client({ region });
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Metadata: metadata,
    });

    return await getSignedUrl(client, command, {
        expiresIn: expirationTime,
    });
};
