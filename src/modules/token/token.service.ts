import DefaultRpcExecption from '@/common/exceptions/exception/defaultRpc.exception';
import {
    TokenPayloadType,
    TokenType,
    TokenWithVerifyType,
} from '@/common/types';
import configs from '@/configs/configuration';
import { PrismaService } from '@/prisma/prisma.service';
import { calculateExpirationTime } from '@/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ITokenSerivce } from './token.service.interface';

@Injectable()
export class TokenService implements ITokenSerivce {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    public generateKeyPairs() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });
    }

    public getTokenexpiresTime(type: TokenWithVerifyType) {
        switch (type) {
            case TokenWithVerifyType.ACCESS_TOKEN:
                return configs.accessTokenExpiresTime;
            case TokenWithVerifyType.REFRESH_TOKEN:
                return configs.refreshTokenExpiresTime;
            case TokenWithVerifyType.VERIFY:
            default:
                return configs.accessTokenExpiresTime;
        }
    }

    public async generateToken(
        payload: TokenPayloadType | any,
        privateKey: crypto.KeyObject,
        options: {
            type: TokenWithVerifyType;
        },
    ) {
        const expiresTime = this.getTokenexpiresTime(options.type);
        const token = await this.jwt.signAsync(payload, {
            privateKey,
            algorithm: 'RS256',
            expiresIn: expiresTime,
        });

        return {
            value: token,
            expiresIn: calculateExpirationTime(expiresTime),
        };
    }

    public convertPublicKeyToString(publicKey: crypto.KeyObject) {
        return publicKey.export({
            type: 'spki',
            format: 'pem',
        }) as string;
    }

    public async extractToken(
        token: string,
        publicKey: crypto.KeyObject | string,
    ): Promise<TokenPayloadType> {
        try {
            const data = await this.jwt.verifyAsync(token, {
                publicKey:
                    typeof publicKey === 'string'
                        ? publicKey
                        : this.convertPublicKeyToString(publicKey),
                algorithms: ['RS256'],
            });
            return data;
        } catch (error) {
            throw new DefaultRpcExecption({
                error: error.message,
                status: HttpStatus.FORBIDDEN,
            });
        }
    }

    async findTokenPublicKeyByUserId(userId: string, type: TokenType) {
        try {
            const data = await this.prisma.tokens.findUnique({
                where: {
                    userId_type: {
                        type,
                        userId,
                    },
                },
                select: {
                    tokenPublicKey: true,
                },
            });
            return data?.tokenPublicKey;
        } catch (error) {
            throw new DefaultRpcExecption({
                error: error.message,
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }

    async saveToken(publicKey: string, userId: string, type: TokenType) {
        await this.prisma.tokens.upsert({
            where: {
                userId_type: {
                    type,
                    userId,
                },
            },
            update: {
                tokenPublicKey: publicKey,
            },
            create: {
                tokenPublicKey: publicKey,
                userId: userId,
                type: type,
            },
        });
    }

    async getNewAccessToken(userId: string, refreshToken: string) {
        const publicKey = await this.findTokenPublicKeyByUserId(
            userId,
            TokenType.REFRESH_TOKEN,
        );
        const data = await this.extractToken(refreshToken, publicKey);

        const accessTokenKeypair = this.generateKeyPairs();

        const payload: TokenPayloadType = {
            email: data.email,
            role: data.role,
            sub: data.sub,
            username: data.username,
        };
        const accessToken = await this.generateToken(
            payload,
            accessTokenKeypair.privateKey,
            {
                type: TokenWithVerifyType.ACCESS_TOKEN,
            },
        );

        await this.saveToken(
            this.convertPublicKeyToString(accessTokenKeypair.publicKey),
            userId,
            TokenType.ACCESS_TOKEN,
        );

        return accessToken;
    }
}
