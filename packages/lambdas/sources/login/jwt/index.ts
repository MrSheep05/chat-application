import { createJWT } from "@chat-lambdas-libs/jwt";
import type { GenerateJWTPairFn } from "./types";

const ONE_SECOND = 60;
const ONE_WEEK = 7 * 24 * 60 * 60;

export const generateJWTPair: GenerateJWTPairFn = async ({
  userId,
  username,
}) => {
  const { kmsJwtAliasName, kmsRefreshJwtAliasName } = process.env;

  if (!kmsJwtAliasName || !kmsRefreshJwtAliasName) {
    throw new Error("Environment variables are not set");
  }

  const token = await createJWT({
    userId,
    username,
    aliasName: kmsJwtAliasName,
    expiresIn: ONE_SECOND,
  });

  const refreshToken = await createJWT({
    userId,
    username,
    aliasName: kmsRefreshJwtAliasName,
    expiresIn: ONE_WEEK,
  });

  return {
    token,
    refreshToken,
  };
};
