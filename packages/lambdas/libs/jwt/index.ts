import { sign } from "@chat-lambdas-libs/kms";

export const createJWT = async ({ userId, username, aliasName, expiresIn }) => {
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
