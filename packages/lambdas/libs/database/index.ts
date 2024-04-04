import { queryProcedure } from "./procedure";
import { Procedure, ProcedureOutput } from "./types";

const getConnections: GetConnectionsFn = async (connectionId) => {
  const { result } = await queryProcedure({ type: Procedure.GetConnections });
  if (result.type === ProcedureOutput.GetConnections) {
    const { payload } = result;
    const { userId } = payload.find(({ id }) => id === connectionId) ?? {};
    return {
      userId,
      connections: payload.map(({ id }) => id),
    };
  }
  throw Error("Unexpected output type from procedure!");
};

type GetConnectionsFn = (
  connectionId?: string
) => Promise<GetConnectionsResponse>;
interface GetConnectionsResponse {
  userId?: string;
  connections: string[];
}
export { queryProcedure, getConnections };
