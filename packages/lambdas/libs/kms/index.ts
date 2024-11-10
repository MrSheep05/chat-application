// Heavily inspired by https://github.com/Jex-y/jwt-on-kms
import {
    KMSClient,
    GetPublicKeyCommand,
    SignCommand,
} from '@aws-sdk/client-kms';
import { webcrypto } from 'crypto';
import {
    TokenError,
    type GetClientFn,
    type GetPublicKeyFn,
    type PubKeyCache,
    type SignFn,
    type VerifyFn,
} from './types';

export { TokenError } from './types';

const { subtle } = webcrypto;

const SUBJECT_PUBLIC_KEY_INFO_FORMAT = 'spki';
const KEY_USAGE_VERIFY = 'verify';
const EXTRACTABLE = true;
const IMPORT_ALGORITHM = {
    name: 'RSA-PSS',
    hash: { name: 'SHA-256' },
};
const SIGNING_ALGORITHM_NAME = 'RSASSA_PSS_SHA_256';
const SIGNING_ALGORITHM_DETAILS = {
    name: 'RSA-PSS',
    saltLength: 32,
};
const JWT_TOKEN_TYPE = 'JWT';

let client: KMSClient | undefined;

const pubKeyCache: PubKeyCache = {};

const getClient: GetClientFn = () => {
    if (!client) {
        client = new KMSClient({});
    }
    return client;
};

const getPublicKey: GetPublicKeyFn = async (keyId) => {
    if (pubKeyCache[keyId]) {
        return pubKeyCache[keyId];
    }

    const result = await getClient().send(
        new GetPublicKeyCommand({
            KeyId: keyId,
        }),
    );

    if (!result.PublicKey) {
        throw new Error(`No public key found for key ID: ${keyId}`);
    }

    const key = await subtle.importKey(
        SUBJECT_PUBLIC_KEY_INFO_FORMAT,
        Buffer.from(result.PublicKey),
        IMPORT_ALGORITHM,
        EXTRACTABLE,
        [KEY_USAGE_VERIFY],
    );

    if (!key) {
        throw new Error(`Invalid key recieved for key ID: ${keyId}`);
    }

    pubKeyCache[keyId] = key;

    return key;
};

export const sign: SignFn = async (payload, keyId, options) => {
    try {
        const { expiresIn, expiresAt } = options || {};
        const now = Date.now() / 1000;

        const headerString = JSON.stringify({
            alg: SIGNING_ALGORITHM_NAME,
            typ: JWT_TOKEN_TYPE,
        });

        const payloadString = JSON.stringify({
            ...payload,
            ...{
                iat: Math.floor(now),
            },
            ...(expiresIn && {
                exp: Math.floor(now + expiresIn),
            }),
            ...(expiresAt && {
                exp: Math.floor(expiresAt.getTime() / 1000),
            }),
        });

        const headerEncoded = Buffer.from(headerString).toString('base64url');
        const payloadEncoded = Buffer.from(payloadString).toString('base64url');
        const messageBuffer = Buffer.from(`${headerEncoded}.${payloadEncoded}`);

        if (messageBuffer.length > 4096) {
            throw new Error('Message must be less than 4096 bytes');
        }

        const result = await getClient().send(
            new SignCommand({
                KeyId: keyId,
                Message: messageBuffer,
                SigningAlgorithm: SIGNING_ALGORITHM_NAME,
            }),
        );

        if (!result?.Signature) {
            throw new Error('Result missing signature');
        }

        const signatureEncoded = Buffer.from(result.Signature).toString(
            'base64url',
        );

        return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
    } catch (error) {
        console.error('[KMS Utils] error signing', error);

        throw new Error(`Failed to sign the payload, ${error}`);
    }
};

export const verify: VerifyFn = async (token, keyId) => {
    const parts = token.split('.');
    const pubKeyPromise = getPublicKey(keyId);

    if (parts.length !== 3) {
        return {
            isValid: false,
            error: TokenError.InvalidToken,
        };
    }

    const [headerString, payloadString, signatureBase64] = parts;
    const signatureString = Buffer.from(signatureBase64, 'base64url');
    const message = `${headerString}.${payloadString}`;

    const result = await subtle.verify(
        SIGNING_ALGORITHM_DETAILS,
        await pubKeyPromise,
        signatureString,
        Buffer.from(message),
    );

    if (!result) {
        return {
            isValid: false,
            error: TokenError.InvalidSignature,
        };
    }

    try {
        const payload = JSON.parse(
            Buffer.from(payloadString, 'base64url').toString(),
        );

        if (payload.exp) {
            const now = new Date().getTime() / 1000;

            if (payload.exp < now) {
                return {
                    isValid: false,
                    error: TokenError.TokenExpired,
                    payload,
                };
            }
        }

        return {
            isValid: true,
            payload,
        };
    } catch (error) {
        console.error('[KMS Utils] error verifying', error);

        return {
            isValid: false,
            error: TokenError.InvalidPayload,
        };
    }
};
