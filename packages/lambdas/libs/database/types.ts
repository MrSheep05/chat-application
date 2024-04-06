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
    | GetUserDataResponse
    | RemoveMessageResponse
    | GetConnectionsResponse
    | MessagesResponse
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
  AddMessage = 1,
  GetUserData = 2,
  RemoveMessage = 3,
  GetConnections = 4,
  GetMessages = 5,
  Other = 0, //FALSE
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

export type MessageBody = {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  visible: boolean;
};

type MessagesResponse = {
  type: ProcedureOutput.GetMessages | ProcedureOutput.AddMessage;
  payload: MessageBody[];
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
  payload: { updateCount: number }[];
};

type GetConnectionsResponse = {
  type: ProcedureOutput.GetConnections;
  payload: {
    id: string;
    userId: string;
  }[];
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
