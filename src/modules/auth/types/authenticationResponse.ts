import { TokenPairType } from '@/modules/token/types';
import { UserReponseType } from '@/modules/user/types';

export type AuthenticaionResponse = {
    user: UserReponseType;
    tokens: TokenPairType;
};
