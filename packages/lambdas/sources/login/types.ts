declare global {
    namespace NodeJS {
        interface ProcessEnv {
            kmsJwtAliasName?: string;
            kmsRefreshJwtAliasName?: string;
            salt?: string;
        }
    }
}

interface Headers {
    [key: string]: string;
}

export interface HandlerResponse {
    statusCode: number;
    headers: Headers;
    body?: string;
}
