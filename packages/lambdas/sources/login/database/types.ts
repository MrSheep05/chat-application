interface GetUserDataResponse {
    id: string;
    password: string;
}

export type GetUserDataFn = (username: string) => Promise<GetUserDataResponse>;
