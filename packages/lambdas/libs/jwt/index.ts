import { sign } from "@chat-lambdas-libs/kms";
import { CreateJWTFn } from "./types";

export const createJWT: CreateJWTFn = async ({
  aliasName,
  expiresIn,
  userId,
  username,
}) => {
  const token = await sign(
    {
      sub: userId,
      iss: "chat",
      username,
    },
    aliasName,
    {
      expiresIn,
    }
  );

  return token;
};
