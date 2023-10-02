import { Body, Controller, HttpStatus } from '@nestjs/common';
import { TokenService } from './token.service';
import { MessagePattern } from '@nestjs/microservices';
import { TokenType } from '@/common/types';
import DefaultRpcExecption from '@/common/exceptions/exception/defaultRpc.exception';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) {}

    @MessagePattern('auth-extract-token')
    async extractToken(
        @Body() data: { userId: string; token: string; type: TokenType },
    ) {
        const publicKey = await this.tokenService.findTokenPublicKeyByUserId(
            data.userId,
            data.type,
        );

        if (!publicKey) {
            throw new DefaultRpcExecption({
                error: 'UNAUTHORIZED',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        return await this.tokenService.extractToken(data.token, publicKey);
    }

    @MessagePattern('auth-refresh-token')
    async getRefreshToken(
        @Body() data: { userId: string; refreshToken: string },
    ) {
        return this.tokenService.getNewAccessToken(
            data.userId,
            data.refreshToken,
        );
    }
}
