import {
    TokenPayloadType,
    TokenType,
    TokenWithVerifyType,
} from '@/common/types';
import * as crypto from 'crypto';
import { Token } from './types';

export interface ITokenSerivce {
    /**
     *  Generate public key and private key using RSA algorithm
     * @returns public key and private key
     */
    generateKeyPairs(): crypto.KeyPairKeyObjectResult;

    /**
     *  Get token expreies time form config
     * @param type type of token (access token, refresh token, verify token)
     */
    getTokenexpiresTime(type: TokenWithVerifyType): string;

    /**
     *
     * @param payload token payload
     * @param privateKey private key using genergate token
     * @param options  options
     * @returns {object} a token and expries time
     */
    generateToken(
        payload: TokenPayloadType | any,
        privateKey: crypto.KeyObject,
        options?: {
            type: TokenWithVerifyType;
        },
    ): Promise<Token>;

    /**
     * Convert public key to string
     * ```js
     *     type: 'spki',
     *     format: 'pem',
     * ```
     * @param publicKey
     * @returns {string} public key string
     */
    convertPublicKeyToString(publicKey: crypto.KeyObject): string;

    /**
     * Extract token
     * @param token token string
     * @param {crypto.KeyObject | string} publicKey publickey from db
     * @returns data of token
     */
    extractToken(
        token: string,
        publicKey: crypto.KeyObject | string,
    ): Promise<TokenPayloadType>;

    /**
     *  Find public key of token from db by user id
     * @param userId id of user from db
     * @param type type of token (access token, refresh token)
     * @returns public key from db
     */
    findTokenPublicKeyByUserId(
        userId: string,
        type: Omit<TokenType, 'verify'>,
    ): Promise<string>;

    /**
     *  Get new access token using refresh token
     * @param userId id of user
     * @param  refreshToken refresh token
     * @returns new access token
     */
    getNewAccessToken(userId: string, refreshToken: string): Promise<Token>;
}
