export enum Effect {
    Deny = 'Deny',
    Allow = 'Allow',
}

interface Statement {
    Action: string;
    Effect: Effect;
    Resource: string;
}

interface IPolicyDocument {
    Version: string;
    Statement: Statement[];
}

export interface IGeneratedPolicy {
    principalId: string;
    policyDocument: IPolicyDocument;
}

export type GeneratePolicyFn = (
    effect: Effect,
    resource: string,
) => IGeneratedPolicy;

export type GenerateAllowFn = (resource: string) => IGeneratedPolicy;

export type GenerateDenyFn = (resource: string) => IGeneratedPolicy;
