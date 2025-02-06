import { StreamingBlobPayloadOutputTypes } from "@smithy/types";

export type GetObjectFn = ({}: {
  bucket: string;
  key: string;
}) => Promise<Buffer | null>;

export type PutObjectFn = ({}: {
    bucket: string;
    key: string;
    body: Buffer;
}) => Promise<boolean>;
