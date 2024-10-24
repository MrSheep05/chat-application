import { middleware } from "@chat-lambdas-libs/logs";
import { createResponse } from "@chat-lambdas-libs/response";
import { Handler, S3Event } from "aws-lambda";
import { updateUserProfileAvatar } from "./database";

/*
{
    "Records": [
        {
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "tf-s3-lambda-20241003195716022400000001",
                "bucket": {
                    "name": "chat-avatars-0luhsnz0s2",
                    "ownerIdentity": {
                        "principalId": "A3RCUXGS87QXMI"
                    },
                    "arn": "arn:aws:s3:::chat-avatars-0luhsnz0s2"
                },
                "object": {
                    "key": "users/4bc22ead-2581-11ef-a9eb-0afd7d52d28d/avatar.png",
                    "size": 22937,
                    "eTag": "d329718a334e6cfa4c4302077290270c",
                    "sequencer": "00670811B00B526EC7"
                }
            }
        }
    ]
}
*/

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
