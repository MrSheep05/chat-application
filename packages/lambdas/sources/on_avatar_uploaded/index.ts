import { middleware } from '@chat-lambdas-libs/logs';
import { createResponse } from '@chat-lambdas-libs/response';
import { Handler, S3Event } from 'aws-lambda';
import { getObject, putObject } from './s3';
import { Jimp, JimpMime } from 'jimp';

export const handler: Handler<S3Event> = middleware(async (event) => {
    const [firstRecord] = event.Records;

    if (!firstRecord?.s3?.object) {
        console.error('Received invalid event format');
        return createResponse({
            statusCode: 400,
            message: 'Invalid format',
        });
    }

    const { key = '' } = firstRecord.s3.object;
    const [folder, uid] = key.split('/');
    const { name: bucket } = firstRecord.s3.bucket;
    if (folder !== 'uploads' || !uid) {
        console.error('Invalid avatar location received:', { folder, key });
        return createResponse({
            statusCode: 400,
            message: 'Invalid avatar location',
        });
    }

  const objectBody = await getObject({ bucket, key });

  if (objectBody === null) {
    throw new Error("Failed to load the file");
  }

  const image = await Jimp.read(objectBody);

  image.resize({ w: 128, h: 128 });

  const imageBuffer = await image.getBuffer("image/png");

  console.log("jimpObject", { imageBuffer });

  const uploadSuccess = await putObject({
    bucket,
    key: `users/${uid}`,
    body: imageBuffer,
  });

    if (uploadSuccess === false) {
        throw new Error('Failed to save the resized file');
    }
});

// const jimp = await Jimp.read(object.Body as Buffer);
// const buffer = await jimp.resize(width, Jimp.AUTO).getBufferAsync(object.ContentType);

// const originObjectPath = path.parse(key);
// const copiedObjectKey = `${originObjectPath.dir}/${width}/${originObjectPath.base}`;

// await s3.putObject({
//     Body: buffer,
//     Bucket: bucket,
//     Key: copiedObjectKey,
//     ACL: 'public-read',
//     ContentType: object.ContentType
// }).promise();
