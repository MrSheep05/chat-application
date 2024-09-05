import { middleware } from "@chat-lambdas-libs/logs";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { getUserData } from "./database";
import { createResponse } from "@chat-lambdas-libs/response";
import { createPresignedUrl } from "@chat-lambdas-libs/s3";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    console.info("Message", event.body);

    const { connectionId } = event.requestContext;
    const { bucketName } = process.env;

    console.info(
      "Varaibs BucketName:",
      bucketName,
      "ConnectionID",
      connectionId
    );

    if (!bucketName || !connectionId) {
      return createResponse({ statusCode: 500 });
    }

    const userData = await getUserData(connectionId);

    console.info("USERDATA ", userData);

    const { id } = userData;
    const path = `/users/${id}/avatar.png`;

    const presignedUrl = await createPresignedUrl({
      bucket: bucketName,
      path,
    });

    return createResponse({
      statusCode: 200,
      message: {
        presignedUrl,
      },
    });
  }
);
