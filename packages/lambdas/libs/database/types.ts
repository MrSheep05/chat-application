export enum PARAMETER_TYPES {
  IN = "in",
  OUT = "out",
}

export type QueryProcedureFn = (
  procedure: StoredProcedure
) => Promise<ProcedureResponse>;

export type ProcessQueryFn = ({
  type,
  inputs,
}: {
  type: Procedure;
  inputs?: any[];
}) => Promise<{ results: any; fields: any }>;
export interface ProcedureResponse {
  result:
    | AddMessageResponse
    | GetUserDataResponse
    | RemoveMessageResponse
    | GetConnectionsResponse
    | { type: ProcedureOutput.Other; payload: any };
  fields: any[];
}

export enum Procedure {
  AddConnection = "AddConnection",
  AddMessage = "AddMessage2",
  GetConnections = "GetConnections",
  GetMessages = "GetMessages2",
  GetUserData = "GetUserData2",
  RegisterUser = "RegisterUser",
  RemoveConnection = "RemoveConnection",
  RemoveMessage = "RemoveMessage2",
}

export enum ProcedureOutput {
  AddMessage,
  GetUserData,
  RemoveMessage,
  GetConnections,
  Other,
}

export type StoredProcedure =
  | AddConnectionProcedure
  | AddMessageProcedure
  | GetConnectionsProcedure
  | GetMessagesProcedure
  | GetUserDataProcedure
  | RegisterUserProcedure
  | RemoveConnectionProcedure
  | RemoveMessageProcedure;

type AddMessageResponse = {
  type: ProcedureOutput.AddMessage;
  payload: {
    id: string;
    user_id: string;
    username: string;
    message: string;
    timestamp: number;
    visible: boolean;
  }[];
};

type GetUserDataResponse = {
  type: ProcedureOutput.GetUserData;
  payload: {
    id: string;
    password: string;
    username: string;
  }[];
};

type RemoveMessageResponse = {
  type: ProcedureOutput.RemoveMessage;
  payload: number[];
};

type GetConnectionsResponse = {
  type: ProcedureOutput.GetConnections;
  payload: {
    id: string;
    user_id: string;
  };
};
type AddConnectionProcedure = {
  type: Procedure.AddConnection;
  payload: {
    userId: string;
    connectionId: string;
  };
};

type AddMessageProcedure = {
  type: Procedure.AddMessage;
  payload: { userId: string; content: string };
};

type GetConnectionsProcedure = {
  type: Procedure.GetConnections;
};

type GetMessagesProcedure = {
  type: Procedure.GetMessages;
  payload: { messageId: string | null };
};

type GetUserDataProcedure = {
  type: Procedure.GetUserData;
  payload: {
    username: string;
  };
};

type RegisterUserProcedure = {
  type: Procedure.RegisterUser;
  payload: {
    username: string;
    password: string;
  };
};

type RemoveConnectionProcedure = {
  type: Procedure.RemoveConnection;
  payload: {
    connectionId: string;
  };
};

type RemoveMessageProcedure = {
  type: Procedure.RemoveMessage;
  payload: {
    connectionId: string;
    messageId: string;
  };
};
