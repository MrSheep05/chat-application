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
      return createOutput({ result, type: ProcedureOutput.GetMessages });
    }
    case Procedure.GetUserData: {
      const { username, connectionId } = {
        username: null,
        connectionId: null,
        ...procedure.payload,
      };
      const result = await processQuery({
        type,
        inputs: [username, connectionId],
      });
      return createOutput({
        result,
        type: ProcedureOutput.GetUserData,
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
      const result = await processQuery({
        type,
        inputs: [connectionId, messageId],
      });
      return createOutput({ result, type: ProcedureOutput.RemoveMessage });
    }
    case Procedure.AddMessage: {
      const { userId, content } = procedure.payload;
      const result = await processQuery({
        type,
        inputs: [userId, content],
      });
      return createOutput({
        result,
        type: ProcedureOutput.AddMessage,
      });
    }
    case Procedure.GetConnections: {
      const result = await processQuery({
        type,
      });
      return createOutput({ result, type: ProcedureOutput.GetConnections });
    }
    case Procedure.UpdateUserProfileAvatar: {
      const { userId, avatarKey } = procedure.payload;

      const result = await processQuery({ type, inputs: [userId, avatarKey] });
      return createOutput({ result });
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
  type,
}: {
  result: { results: any; fields: any };
  type?: ProcedureOutput;
}): ProcedureResponse => {
  const { results, fields } = result;
  const payload =
    typeof results[Symbol.iterator] === "function" ? results[0] : results;
  return type
    ? {
        result: { type, payload },
        fields,
      }
    : {
        result: { type: ProcedureOutput.Other, payload },
        fields,
      };
};

const processQuery: ProcessQueryFn = async ({ type, inputs = [] }) => {
  const connection = await connect();
  const [inputSQL, queryInputs] = inputs.reduce<[string[], any[]]>(
    ([inputSQL, queryInputs], val) => {
      return val === null
        ? [[...inputSQL, "NULL"], queryInputs]
        : [
            [...inputSQL, "?"],
            [...queryInputs, val],
          ];
    },
    [[], []]
  );
  // const inputSQL = Array.from({ length: inputs.length }, () => "?").join(",");
  // const queryInputsTwo = [...inputs].map((value) =>
  //   value === null ? "NULL" : value
  // );
  const query = `CALL ${type}(${inputSQL.join(",")});`;
  console.info(`QUERY INPUT`, queryInputs);
  console.info(`QUERY`, query);
  return new Promise((resolve, reject) => {
    connection.query(query, queryInputs, (error, results, fields) => {
      connection.end();
      if (error) {
        console.error(error);
        reject(error);
      }
      console.log(`RESULT`, results);
      console.log(results);
      console.log(`FIELDS`, fields);
      resolve({ results, fields });
    });
  });
};

// const findOutput = <R>(data: any, key: string): R | null => {
//   if (!data) return null;
//   console.log(data, key);
//   if (key in data) {
//     console.log("Found data", data[key]);
//     return data[key];
//   }

//   if (Array.isArray(data)) {
//     return data.reduce((output, item) => {
//       if (output) return output;

//       return findOutput(item, key);
//     }, null);
//   }

//   return null;
// };
