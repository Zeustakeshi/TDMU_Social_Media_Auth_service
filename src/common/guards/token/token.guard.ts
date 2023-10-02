import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export abstract class TokenGaurd implements CanActivate {
    abstract canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean>;

    protected extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    protected extractUserIdFromHeader(request: Request): string | undefined {
        const userId = request.get('X-User-Id');
        return userId;
    }
}
