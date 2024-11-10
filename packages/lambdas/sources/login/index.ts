import type { APIGatewayProxyEvent, Handler } from "aws-lambda";
import type { HandlerResponse } from "./types";

import { createResponse } from "@chat-lambdas-libs/response";
import { generateJWTPair } from "./jwt";
import { hash } from "./password";
import { getUserData } from "./database";
import { middleware } from "@chat-lambdas-libs/logs";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event): Promise<HandlerResponse> => {
    if (typeof event?.body !== "string") {
      return createResponse({ statusCode: 400 });
    }

    const { username, password } = JSON.parse(event.body);

    if (typeof username !== "string" || typeof password !== "string") {
      return createResponse({ statusCode: 400 });
    }

    try {
      const { password: passwordHash, id: userId } =
        await getUserData(username);

      if (hash(password) !== passwordHash) {
        console.log("Invalid credentials. Returning 400 to the client.");
        return createResponse({
          statusCode: 400,
          message: "Invalid Credentials",
        });
      }

      const { token, refreshToken } = await generateJWTPair({
        userId,
        username,
      });

      return createResponse({ message: { token, refreshToken } });
    } catch (error) {
      console.error("Encountered an error:", error);
      return createResponse({ statusCode: 500 });
    }
  },
);
