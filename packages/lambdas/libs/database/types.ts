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
  outputs,
}: {
  type: Procedure;
  inputs?: any[];
  outputs?: string[];
}) => Promise<{ results: any; fields: any }>;
export interface ProcedureResponse {
  result:
    | AddMessageResponse
    | GetUserDataResponse
    | RemoveMessageResponse
    | { type: ProcedureOutput.Other; payload: any };
  fields: any[];
}

export enum Procedure {
  AddConnection = "AddConnection",
  AddMessage = "AddMessage",
  GetConnections = "GetConnections",
  GetMessages = "GetMessages",
  GetUserData = "GetUserData",
  RegisterUser = "RegisterUser",
  RemoveConnection = "RemoveConnection",
  RemoveMessage = "RemoveMessage",
}

export enum ProcedureOutput {
  AddMessage,
  GetUserData,
  RemoveMessage,
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
  };
};

type GetUserDataResponse = {
  type: ProcedureOutput.GetUserData;
  payload: {
    id: string;
    password: string;
    username: string;
  };
};

type RemoveMessageResponse = {
  type: ProcedureOutput.RemoveMessage;
  payload: number;
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
  outputs: {
    messageData: string;
  };
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
  outputs: {
    userData: string;
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
  outputs: {
    updateCount: string;
  };
};
