import { middleware } from "@chat-lambdas-libs/logs";
import { S3ObjectCreatedNotificationEvent, Handler } from "aws-lambda";

export const handler: Handler<S3ObjectCreatedNotificationEvent> = middleware(
  async (event) => {
    console.info("EVENT", JSON.stringify(event));
  }
);
