import { CreateBodyFn, CreateResponseFn, ITemplates } from "./types";

const TEMPLATES: ITemplates = {
  200: "OK",
  400: "Not Found",
  500: "Internal Server Error",
};

const createBody: CreateBodyFn = (statusCode, message) => {
  if (message) {
    return JSON.stringify({ message });
  }

  if (statusCode in TEMPLATES) {
    return TEMPLATES[statusCode];
  }
};

export const createResponse: CreateResponseFn = ({
  statusCode = 200,
  message,
}) => {
  const body = createBody(statusCode, message);

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body,
  };
};
