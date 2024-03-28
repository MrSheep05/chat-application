import { ProcedureCallPacket } from "mysql2";
import { connect } from "./rds";
import {
  type QueryProcedureFn,
  type PARAMETER_TYPES,
  type ProcessQueryFn,
  Procedure,
  ProcedureOutput,
  ProcedureResponse,
} from "./types";

export const queryProcedure: QueryProcedureFn = async (procedure) => {
  const { type } = procedure;
  switch (type) {
    case Procedure.AddConnection: {
      const { connectionId, userId } = procedure.payload;
      const result = await processQuery({
        type,
        inputs: [userId, connectionId],
      });
      return createOutput({ result });
    }
    case Procedure.GetMessages: {
      const { messageId } = procedure.payload;
      const result = await processQuery({
        type,
        inputs: [messageId],
      });
      return createOutput({ result });
    }
    case Procedure.GetUserData: {
      const { username } = procedure.payload;
      const { userData } = procedure.outputs;
      const result = await processQuery({
        type,
        inputs: [username],
        outputs: [userData],
      });
      return createOutput({
        result,
        type: ProcedureOutput.GetUserData,
        outputKey: `@${userData}`,
        isJSON: true,
      });
    }
    case Procedure.RegisterUser: {
      const { username, password } = procedure.payload;
      const result = await processQuery({
        type,
        inputs: [username, password],
      });
      return createOutput({ result });
    }
    case Procedure.RemoveConnection: {
      const { connectionId } = procedure.payload;
      const result = await processQuery({
        type,
        inputs: [connectionId],
      });
      return createOutput({ result });
    }
    case Procedure.RemoveMessage: {
      const { connectionId, messageId } = procedure.payload;
      const { updateCount } = procedure.outputs;
      const result = await processQuery({
        type,
        inputs: [connectionId, messageId],
        outputs: [updateCount],
      });
      return createOutput({ result });
    }
    case Procedure.AddMessage: {
      const { userId, content } = procedure.payload;
      const { messageData } = procedure.outputs;
      const result = await processQuery({
        type,
        inputs: [userId, content],
        outputs: [messageData],
      });
      return createOutput({
        result,
        type: ProcedureOutput.AddMessage,
        outputKey: `@${messageData}`,
        isJSON: true,
      });
    }
    default: {
      const result = await processQuery({
        type,
      });
      return createOutput({ result });
    }
  }
};

const createOutput = ({
  result,
  outputKey,
  type,
  isJSON = false,
}: {
  result: { results: any; fields: any };
  type?: ProcedureOutput;
  outputKey?: string;
  isJSON?: boolean;
}): ProcedureResponse => {
  const { results, fields } = result;
  if (outputKey && type) {
    const output = findOutput<any>(results, outputKey);
    const ret = {
      result: { type, payload: isJSON ? JSON.parse(output) : output },
      fields,
    };
    console.log("RETURN ", ret);
    return ret;
  } else {
    const ret = {
      result: { type: ProcedureOutput.Other, payload: results },
      fields,
    };
    console.log("RETURN ", ret);
    return ret;
  }
};
const processQuery: ProcessQueryFn = async ({
  type,
  inputs = [],
  outputs = [],
}) => {
  const connection = await connect();
  const inputSQL = Array.from({ length: inputs.length }, () => "?").join(",");
  const outputSQL = outputs.map((e) => `@${e}`).join(",");
  return new Promise((resolve, reject) => {
    connection.query(
      outputs.length === 0
        ? `CALL ${type}(${inputSQL});`
        : `CALL ${type}(${inputSQL} , ${outputSQL}); SELECT ${outputSQL}`,

      [...inputs],
      (error, results, fields) => {
        connection.end();
        if (error) {
          reject(error);
        }
        console.log(`RESULT`, results);
        console.log(results);
        console.log(`FIELDS`, fields);
        resolve({ results, fields });
      }
    );
  });
};

const joinVariables = (vars: any[]): string[] => {
  return vars.map((v) => `'${v}'`);
};

const findOutput = <R>(data: any, key: string): R | null => {
  if (!data) return null;
  if (key in data) {
    console.log("Found data", data[key]);
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
