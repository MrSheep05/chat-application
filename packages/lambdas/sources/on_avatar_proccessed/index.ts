import { middleware } from "@chat-lambdas-libs/logs";
import { createResponse } from "@chat-lambdas-libs/response";
import { Handler, S3Event } from "aws-lambda";
import { updateUserProfileAvatar } from "./database";

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

  if (folder !== "users" || !uid) {
    console.error("Invalid avatar location received:", { folder, key });
    return createResponse({
      statusCode: 400,
      message: "Invalid avatar location",
    });
  }

  const response = await updateUserProfileAvatar({ uid, avatarKey: key });
  console.info("Response from query:", JSON.stringify(response));
});
