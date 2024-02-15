import { createHmac } from "crypto";
import { createJWT } from "@chat-lambdas-libs/jwt";
import { queryProcedure } from "@chat-lambdas-libs/database";

const ONE_WEEK = 7 * 24 * 60 * 60;

const hash = (password) => {
  const hasher = createHmac("sha256", process.env.salt as string);

  hasher.update(password);

  return hasher.digest("base64");
};

export const handler = async (event, _context) => {
  console.info(event);

  const { username, password } = JSON.parse(event.body);

  try {
    const { results } = await queryProcedure({
      name: "GetUserData",
      params: [username],
      outputs: ["userData"],
    });

    console.log(JSON.stringify(results));

    const [[result]] = results.slice(-1);
    console.log("last result", result);
    const { id: userId, password: passwordHash } = JSON.parse(
      result["@userData"]
    );
    console.log("passwordHash", passwordHash);
    const { kmsJwtAliasName, kmsRefreshJwtAliasName } = process.env;
    console.log(kmsJwtAliasName, kmsRefreshJwtAliasName);
    if (hash(password) === passwordHash) {
      console.log("Passwords Match");
      const token = await createJWT({
        userId,
        username,
        aliasName: kmsJwtAliasName,
        expiresIn: 60,
      });
      const refreshToken = await createJWT({
        userId,
        username,
        aliasName: kmsRefreshJwtAliasName,
        expiresIn: ONE_WEEK,
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ token, refreshToken }),
      };
    }

    console.log("Passwords DO NOT Match");

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Username or Password are incorrect" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        body: "some error occured",
      },
    };
  }
};
