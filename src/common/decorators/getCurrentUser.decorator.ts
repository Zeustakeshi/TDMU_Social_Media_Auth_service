import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithUser } from '../types';

type ConfigType = keyof RequestWithUser;

export const GetCurrentUser = createParamDecorator(
    (config: ConfigType | undefined, context: ExecutionContext) => {
        const data = context.switchToHttp().getRequest();
        if (config) return data.user[config];
        return data.user;
    },
);
