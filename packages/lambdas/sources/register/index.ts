import { createResponse } from "@chat-lambdas-libs/response";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { registerUser } from "./database";
import { hashPassword } from "./password";

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  const { username, password } = JSON.parse(event.body ?? "{}");
  if (!username || !password) return createResponse({ statusCode: 400 });

  const hashedPassword = hashPassword(password);
  if (!hashedPassword) return createResponse({ statusCode: 400 });

  try {
    await registerUser({ username, password });
  } catch (error) {
    console.error("Failed to execute the procedure", error);
    return createResponse({ statusCode: 400, message: "User already exist!" });
  }
  return createResponse({
    statusCode: 200,
  });
};
