export type VerifyTokensFn = (
  token: string,
  refreshToken: string
) => Promise<void>;
export type CreateKeyPairFn = (
  token: string
) => Promise<{ token: string; refreshToken: string }>;
