import { ROLE } from '../enums';

export type TokenPayloadType = {
    sub: string;
    email: string;
    username: string;
    role: ROLE;
};

export enum TokenType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum TokenWithVerifyType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    VERIFY = 'VERIFY',
}
