import {
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const getObject: GetObjectFn = async ({ bucket, key }) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  return response?.Body ?? null;
};

export interface SdkStreamMixin {
  transformToByteArray: () => Promise<Uint8Array>;
  transformToString: (encoding?: string) => Promise<string>;
  transformToWebStream: () => ReadableStream;
}

type GetObjectFn = ({}: {
  bucket: string;
  key: string;
}) => Promise<SdkStreamMixin | null>;
