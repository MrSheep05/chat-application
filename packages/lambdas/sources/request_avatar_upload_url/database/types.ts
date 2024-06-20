interface GetUserDataResponse {
  id: string;
  username: string;
}

export type GetUserDataFn = (
  connectionId: string
) => Promise<GetUserDataResponse>;
