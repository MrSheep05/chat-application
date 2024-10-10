import { middleware } from "@chat-lambdas-libs/logs";
import { Handler, S3Event } from "aws-lambda";

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
  console.info("EVENT", JSON.stringify(event));
  const [firstRecord] = event.Records;

  if (!firstRecord) {
    // return 400
  }

  const { key } = firstRecord.s3.object;

  const [folder, uid] = key.split("/");
});
