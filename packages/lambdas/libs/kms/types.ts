import { KMSClient } from '@aws-sdk/client-kms';
import { webcrypto } from 'crypto';

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
    },
) => Promise<string>;

export type VerifyFn = (
    token: string,
    keyId: string,
) => Promise<{
    isValid: boolean;
    error?: TokenError;
    payload?: {
        [key: string]: any;
    };
}>;

export enum TokenError {
    InvalidPayload = 'Invalid payload',
    InvalidSignature = 'Invalid signature',
    TokenExpired = 'Token expired',
    InvalidToken = 'Invalid token',
}
