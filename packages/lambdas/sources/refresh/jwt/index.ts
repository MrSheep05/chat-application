import { verify } from '@chat-lambdas-libs/kms';
import {
    createJWT,
    doSubjectsMatch,
    getTokenPayload,
} from '@chat-lambdas-libs/jwt';
import { TokenError } from '@chat-lambdas-libs/kms';
import type { CreateKeyPairFn, VerifyTokensFn } from './types';

const { kmsJwtAliasName, kmsRefreshJwtAliasName } = process.env;
const ONE_WEEK = 7 * 24 * 60 * 60;

export const verifyTokens: VerifyTokensFn = async (token, refreshToken) => {
    if (!kmsJwtAliasName || !kmsRefreshJwtAliasName) {
        throw new Error('Missing environment variables for kms aliases');
    }

    const { isValid, error } = await verify(token, kmsJwtAliasName);

    if (!isValid && error !== TokenError.TokenExpired) {
        throw new Error(error);
    }

    const { isValid: isValidRefresh } = await verify(
        refreshToken,
        kmsRefreshJwtAliasName,
    );

    if (!isValidRefresh) {
        throw new Error('Refresh token invalid');
    }

    if (!doSubjectsMatch(token, refreshToken)) {
        throw new Error('Subjects do not match');
    }
};

export const createKeyPair: CreateKeyPairFn = async (originalToken) => {
    if (!kmsJwtAliasName || !kmsRefreshJwtAliasName) {
        throw new Error('Missing environment variables for kms aliases');
    }

    const { sub: userId, username } = getTokenPayload(originalToken);
    const token = await createJWT({
        userId,
        username,
        expiresIn: 60,
        aliasName: kmsJwtAliasName,
    });

    const refreshToken = await createJWT({
        userId,
        username,
        expiresIn: ONE_WEEK,
        aliasName: kmsRefreshJwtAliasName,
    });

    return { token, refreshToken };
};
