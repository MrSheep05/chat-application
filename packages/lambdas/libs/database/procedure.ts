import { ProcedureCallPacket } from "mysql2";
import { connect } from "./rds";
import type { QueryProcedureFn } from "./types";

const PARAMETER_TYPES = {
  IN: "in",
  OUT: "out",
};

const parseParamsToSQL = (params: any[], type = PARAMETER_TYPES.IN) =>
  params
    .map((param) => (type === PARAMETER_TYPES.IN ? `'${param}'` : `@${param}`))
    .join(", ");

export const queryProcedure: QueryProcedureFn = async ({
  name,
  params = [],
  outputs = [],
}) => {
  const connection = await connect();
  const paramsSQL = parseParamsToSQL(params);
  const outputsSQL = parseParamsToSQL(outputs, PARAMETER_TYPES.OUT);
  console.log("paramsSQL", paramsSQL);
  console.log("outputsSQL", outputsSQL);

  return new Promise((resolve, reject) => {
    connection.query(
      outputs.length === 0
        ? `CALL ${name}(${paramsSQL});`
        : `CALL ${name}(${paramsSQL}, ${outputsSQL}); SELECT ${outputsSQL};`,
      true,
      (error, results, fields) => {
        connection.end();
        if (error) {
          return reject(error);
        }
        resolve({ results, fields });
      }
    );
  });
};

export const getOutput = <R>(
  queryResult: { results: ProcedureCallPacket },
  outputKey: string
): R | null => {
  const { results } = queryResult;

  return findOutput(results, outputKey);
};

const findOutput = <R>(data: any, key: string): R | null => {
  if (key in data) {
    return data[key];
  }

  if (Array.isArray(data)) {
    return data.reduce((output, item) => {
      if (output) return output;

      return findOutput(item, key);
    }, null);
  }

  return null;
};
