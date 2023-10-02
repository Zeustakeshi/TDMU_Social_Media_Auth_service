import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenGaurd } from './token.guard';
import { Reflector } from '@nestjs/core';
import { TokenPayloadType, TokenType } from '@/common/types';
import { IS_PUBLIC_KEY } from '@/common/decorators';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class AccessTokenGuard extends TokenGaurd {
    constructor(
        private reflector: Reflector,
        private tokenService: TokenService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        // check public route
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();

        // get access token and userId from header
        const token = this.extractTokenFromHeader(request);
        const userId = this.extractUserIdFromHeader(request);

        if (!token || !userId) throw new UnauthorizedException();

        try {
            const publicKey =
                await this.tokenService.findTokenPublicKeyByUserId(
                    userId,
                    TokenType.ACCESS_TOKEN,
                );

            const data: TokenPayloadType = await this.tokenService.extractToken(
                token,
                publicKey,
            );

            request.user = {
                ...data,
                id: data.sub,
            };
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
