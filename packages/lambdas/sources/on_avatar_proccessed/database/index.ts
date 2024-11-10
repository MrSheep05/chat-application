import { queryProcedure } from '@chat-lambdas-libs/database';
import {
    Procedure,
    ProcedureResponse,
} from '@chat-lambdas-libs/database/types';

export const updateUserProfileAvatar: UpdateUserProfileAvatarFn = async ({
    uid,
    avatarKey,
}) => {
    return await queryProcedure({
        type: Procedure.UpdateUserProfileAvatar,
        payload: { userId: uid, avatarKey },
    });
};

export type UpdateUserProfileAvatarFn = ({
    uid,
    avatarKey,
}: {
    uid: string;
    avatarKey: string;
}) => Promise<ProcedureResponse>;
