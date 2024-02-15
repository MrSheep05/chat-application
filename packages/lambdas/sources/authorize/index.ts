import { verify } from "@chat-lambdas-libs/kms";

export const handler = async (event, _context, callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { queryStringParameters, methodArn } = event;
  const { token } = queryStringParameters;
  const { isValid, error } = await verify(token, process.env.kmsJwtAliasName);

  if (isValid) {
    callback(null, generateAllow(methodArn));
  } else {
    console.log("Invalid token:", error);
    callback(null, generateDeny(methodArn));
  }
};

const generateAllow = (resource) => {
  return generatePolicy("Allow", resource);
};

const generateDeny = (resource) => {
  return generatePolicy("Deny", resource);
};

const generatePolicy = (effect, resource) => {
  return {
    principalId: "me",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        { Action: "execute-api:Invoke", Effect: effect, Resource: resource },
      ],
    },
  };
};
