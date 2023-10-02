import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { RequestWithUser } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const roles: string[] = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const user = request.user as RequestWithUser;
        return roles.includes(user.role);
    }
}
