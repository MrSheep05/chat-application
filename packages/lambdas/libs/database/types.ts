export type QueryProcedureFn = ({
  name,
  params,
  outputs,
}: {
  name: string;
  params?: any[];
  outputs?: any[];
}) => Promise<{
  results: any;
  fields: any;
}>;

interface ProcedureResponse {
  results: {
    [key: string]: any;
  }[];
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

export type StoredProcedure =
  | AddConnectionProcedure
  | AddMessageProcedure
  | GetConnectionsProcedure
  | GetMessagesProcedure
  | GetUserDataProcedure
  | RegisterUserProcedure
  | RemoveConnectionProcedure
  | RemoveMessageProcedure;

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
  payload: { messageId?: string };
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
