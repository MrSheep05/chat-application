export type CreateJWTFn = ({
    aliasName,
    expiresIn,
    userId,
    username,
}: {
    aliasName: string;
    expiresIn?: number;
    userId: string;
    username: string;
}) => Promise<string>;
