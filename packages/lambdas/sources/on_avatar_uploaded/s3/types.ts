export type GetObjectFn = ({}: {
  bucket: string;
  key: string;
}) => Promise<Uint8Array | null>;

export type PutObjectFn = ({}: {
  bucket: string;
  key: string;
  body: Buffer;
}) => Promise<boolean>;
