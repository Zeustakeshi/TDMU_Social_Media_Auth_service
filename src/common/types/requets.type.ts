import { ROLE } from '../enums';
import { TokenPayloadType } from './auth.type';

export type RequestWithUser = {
    id: string;
} & TokenPayloadType;
