import { createHmac } from "crypto";
import { queryProcedure } from "@chat-lambdas-libs/database";

const hash = (password) => {
  const hasher = createHmac("sha256", process.env.salt as string);
  hasher.update(password);
  return hasher.digest("base64");
};

export const handler = async (event, _context) => {
  console.log(event);
  const { username, password } = JSON.parse(event.body);

  try {
    const { results, fields } = await queryProcedure({
      name: "RegisterUser",
      params: [username, hash(password)],
    });
    console.log("Results", results);
    console.log("Fields", fields);
  } catch (error) {
    console.error("Failed to execute the procedure", error);
    return { statusCode: 400, body: "User already exist!" };
  }

  return {
    statusCode: 200,
    body: "Working",
  };
};
