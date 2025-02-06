import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { GetObjectFn, PutObjectFn } from './types';
import { NodeJsClient } from "@smithy/types";

const s3 = new S3Client() as NodeJsClient<S3Client>;


export const getObject: GetObjectFn = async ({ bucket, key }) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3.send(command);

  try {
    if (response.Body) {
      const chunks = []
      for await (let chunk of response.Body) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks);
    }

  } catch (error) {
    console.error("Error when getting object", { error });
  }

  return null;
};

export const putObject: PutObjectFn = async ({ bucket, body, key }) => {
    const command = new PutObjectCommand({
        Body: body,
        Bucket: bucket,
        Key: key,
    });

    try {
        await s3.send(command);
    } catch (error) {
        console.error('Error when putting object', { error });
        return false;
    }

    return true;
};
