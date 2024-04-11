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

export const getTokenPayload = (token: string) => {
  const [, payload] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString());
};

export const doSubjectsMatch = (...tokens: string[]) => {
  const payloads = tokens.map(getTokenPayload);
  const [firstPayload] = payloads;

  return payloads.every(({ sub }) => Boolean(sub) && sub === firstPayload.sub);
};
