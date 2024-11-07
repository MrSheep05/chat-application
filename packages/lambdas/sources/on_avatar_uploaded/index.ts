import { middleware } from "@chat-lambdas-libs/logs";
import { createResponse } from "@chat-lambdas-libs/response";
import { Handler, S3Event } from "aws-lambda";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import * as sharp from "sharp";
import { getObject } from "./s3";

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
  console.info("Read object", { object });
});
