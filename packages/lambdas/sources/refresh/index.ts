import { verify } from "@chat-lambdas-libs/kms";
import { createJWT } from "@chat-lambdas-libs/jwt";

const INVAILD_CASES = ["Invalid token", "Invalid signature"];

const getTokenPayload = (token) => {
  const [, payload] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString());
};

const UNAUTHORISED_RESPONSE = { statusCode: 401 };
const ONE_WEEK = 7 * 24 * 60 * 60;

const { kmsJwtAliasName, kmsRefreshJwtAliasName } = process.env;

export const handler = async (event) => {
  console.log("Received request:", event);

  const { token, refreshToken } = JSON.parse(event.body);
  const { isValid, error } = await verify(token, kmsJwtAliasName);

  if (!isValid && error !== "Token expired") {
    console.log("Token invalid", error);
    return UNAUTHORISED_RESPONSE;
  }

  const { isValid: isValidRefresh } = await verify(
    refreshToken,
    kmsRefreshJwtAliasName
  );

  if (!isValidRefresh) {
    console.log("Refresh token invalid");
    return UNAUTHORISED_RESPONSE;
  }

  const payloads = [refreshToken, token].map(getTokenPayload);
  const [firstPayload] = payloads;

  if (!payloads.every(({ sub }) => Boolean(sub) && sub === firstPayload.sub)) {
    console.log("Subjects do not match");
    return UNAUTHORISED_RESPONSE;
  }

  const { sub: userId, username } = firstPayload;

  const newToken = await createJWT({
    userId,
    username,
    expiresIn: 60,
    aliasName: kmsJwtAliasName,
  });

  const newRefreshToken = await createJWT({
    userId,
    username,
    expiresIn: ONE_WEEK,
    aliasName: kmsRefreshJwtAliasName,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ token: newToken, refreshToken: newRefreshToken }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
