import type {
    GenerateAllowFn,
    GenerateDenyFn,
    GeneratePolicyFn,
} from './types';
import { Effect } from './types';

const generatePolicy: GeneratePolicyFn = (effect, resource) => ({
    principalId: 'me',
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});

export const generateAllow: GenerateAllowFn = (resource) => {
    return generatePolicy(Effect.Allow, resource);
};

export const generateDeny: GenerateDenyFn = (resource) => {
    return generatePolicy(Effect.Deny, resource);
};
