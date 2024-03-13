import { KMSClient } from "@aws-sdk/client-kms";
import { webcrypto } from "crypto";

export interface PubKeyCache {
  [key: string]: webcrypto.CryptoKey;
}

export type GetClientFn = () => KMSClient;

export type GetPublicKeyFn = (keyId: string) => Promise<webcrypto.CryptoKey>;

export type SignFn = (
  payload: {},
  keyId: string,
  options?: {
    expiresIn?: number;
    expiresAt?: Date;
  }
) => Promise<string>;

export type VerifyFn = (
  token: string,
  keyId: string
) => Promise<{
  isValid: boolean;
  error?: string;
  payload?: {
    [key: string]: any;
  };
}>;
