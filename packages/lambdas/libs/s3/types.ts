export interface ICreatePresignedUrlParams {
    bucket: string;
    path: string;
    expirationTime?: number;
    metadata?: Record<string, string>;
    region?: string;
}
