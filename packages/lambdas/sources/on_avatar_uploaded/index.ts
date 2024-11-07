import { middleware } from "@chat-lambdas-libs/logs";
import { createResponse } from "@chat-lambdas-libs/response";
import { Handler, S3Event } from "aws-lambda";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getObject, putObject } from "./s3";

export const handler: Handler<S3Event> = middleware(async (event) => {
  const [firstRecord] = event.Records;

  if (!firstRecord?.s3?.object) {
    console.error("Received invalid event format");
    return createResponse({
      statusCode: 400,
      message: "Invalid format",
    });
  }

  const { key = "" } = firstRecord.s3.object;
  const [folder, uid] = key.split("/");
  const { name: bucket } = firstRecord.s3.bucket;
  if (folder !== "uploads" || !uid) {
    console.error("Invalid avatar location received:", { folder, key });
    return createResponse({
      statusCode: 400,
      message: "Invalid avatar location",
    });
  }

  const object = await getObject({ bucket, key });

  if (object === null) {
    throw new Error("Failed to load the file");
  }

  const sharpObject = await sharp(object).resize(128, 128).toBuffer();

  const uploadSuccess = await putObject({
    bucket,
    key: `users/${uid}`,
    body: sharpObject,
  });

  if (uploadSuccess === false) {
    throw new Error("Failed to save the resized file");
  }
});
