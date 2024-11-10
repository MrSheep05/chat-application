interface IGenerateJWTPairParams {
    userId: string;
    username: string;
}

interface IGenerateJWTPairResponse {
    token: string;
    refreshToken: string;
}

export type GenerateJWTPairFn = ({
    userId,
    username,
}: IGenerateJWTPairParams) => Promise<IGenerateJWTPairResponse>;
