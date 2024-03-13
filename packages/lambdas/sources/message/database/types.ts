interface IAddMessageParams {
  userId: string;
  content: string;
}

export type AddMessageFn = (params: IAddMessageParams) => Promise<string>;

interface GetConnectionsResponse {
  userId?: string;
  connections: { id: string }[];
}

export type GetConnectionsFn = (
  connectionId?: string
) => Promise<GetConnectionsResponse>;
