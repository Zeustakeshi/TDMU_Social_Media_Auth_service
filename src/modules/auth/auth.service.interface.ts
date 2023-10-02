import { UserReponseType } from '../user/types';
import { RegisterDto } from './dtos';
import { LoginDto } from './dtos/login.dto';
import { AuthenticaionResponse } from './types';

export interface IAuthService {
    /**
     * Add verify token public key add to cache
     * @param userId id user from cache
     * @param verifyTokenPub verify token public key add to cache
     */
    setToken(userId: string, verifyTokenPub: string): Promise<boolean>;

    /**
     *  Get emai of user from cache
     * @param userId id of user from cache
     * @throws {Error} If user Id not found from cache
     * @returns {string} email of user
     */
    getCaheUserEmail(userId: string): Promise<string>;

    /**
     * Cache a new user un verify
     *
     * When new a user registers hash user's password and save user  to the cache
     * @param {RegisterDto} dto - An object containing user registration information.
     * @returns {string} - A string representing the ID of the registered user.
     * @throws {ConflictException} If the email address already exists.
     * @throws {InternalServerErrorException} If there is an error during processing.
     */
    cacheUser(dto: RegisterDto): Promise<string>;

    /**
     * Regsiter
     * - Verify email token
     * - Save user to db
     * - Genergate access token and refresh token
     * - Return user and tokens
     * @param token token string from client
     * @param userId id user from cache
     * @throws {BadRequestException} If user id not exists from cache
     * @returns {AuthenticaionResponse} user and tokens
     */
    register(token: string, userId: string): Promise<AuthenticaionResponse>;

    /**
     * Create verify token and send email verify to user
     * @param userId id of user from cache
     */
    registerSendMailVerify(userId: string): Promise<void>;

    /**
     * Login
     *
     * - Get user from db and check password
     * - Genergate access token and refresh token
     * - Return user and tokens
     * @param {LoginDto} dto user data from login form
     * @returns {AuthenticaionResponse} user and tokens
     */
    login(dto: LoginDto): Promise<AuthenticaionResponse>;

    getAuthenticatedUser(dto: LoginDto): Promise<UserReponseType>;
}
