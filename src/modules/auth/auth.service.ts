import { ROLE } from '@/common/enums';
import DefaultRpcExecption from '@/common/exceptions/exception/defaultRpc.exception';
import {
    TokenPayloadType,
    TokenType,
    TokenWithVerifyType,
} from '@/common/types';
import configs from '@/configs/configuration';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { TokenPairType } from '../token/types';
import { UserReponseType } from '../user/types';
import { UserService } from '../user/user.service';
import { IAuthService } from './auth.service.interface';
import { RegisterDto } from './dtos';
import { LoginDto } from './dtos/login.dto';

type userCacheType = {
    verifyTokenPub?: string;
} & RegisterDto;

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly emaiService: EmailService,
    ) {}

    public async setToken(userId: string, verifyTokenPub: string) {
        const user = await this.cacheManager.get<userCacheType>(userId);

        if (!user) {
            throw new BadGatewayException('User id not existed!');
        }
        if (user.verifyTokenPub) return false;
        await this.cacheManager.set(userId, { ...user, verifyTokenPub });
        return true;
    }

    public async getCaheUserEmail(userId: string) {
        const user = await this.cacheManager.get<userCacheType>(userId);
        if (!user)
            throw new DefaultRpcExecption({
                error: 'not found!',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                mess: 'user id not found',
            });
        return user.email;
    }

    async cacheUser(dto: RegisterDto) {
        // check user exist
        if (await this.userService.isExisted(dto.email)) {
            throw new ConflictException('email already existed!!');
        }

        try {
            // hash password
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(dto.password, salt);

            // save to cache
            const userId = uuid.v4();
            await this.cacheManager.set(
                userId,
                {
                    ...dto,
                    password: hashPassword,
                },
                configs.cacheUserReigsterTTL,
            );
            return userId;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    // async register(userId: string) {
    //     const user = await this.cacheManager.get<userCacheType>(userId);
    //     if (!user) throw new BadRequestException('user id not existed');
    //     await this.userService.register(
    //         objectExcludeField(user, ['verifyTokenPub']) as RegisterDto,
    //     );
    // }

    async register(token: string, userId: string) {
        // verify token and extract token
        const userHolder = await this.cacheManager.get<userCacheType>(userId);
        if (!userHolder || !userHolder.verifyTokenPub) {
            throw new BadRequestException();
        }

        await this.tokenService.extractToken(token, userHolder.verifyTokenPub);

        // if extract token with no error, remove token cache and create new user and save to db
        this.cacheManager.del(userId);
        const newUser = await this.userService.register(userHolder);

        // genergate access token and refresh token
        const tokens = await this.getTokenPairs(newUser.id, {
            email: newUser.email,
            role: ROLE.NORMAL,
            sub: newUser.id,
            username: newUser.username,
        });

        return {
            user: newUser,
            tokens: tokens,
        };
    }

    async registerSendMailVerify(userId: string) {
        // genergate key pair
        const { publicKey, privateKey } = this.tokenService.generateKeyPairs();

        // using private key generate token
        const { value: verifyToken } = await this.tokenService.generateToken(
            { userId },
            privateKey,
            { type: TokenWithVerifyType.VERIFY },
        );

        try {
            // save public key to cache
            const publicKeyString =
                this.tokenService.convertPublicKeyToString(publicKey);

            const user = await this.cacheManager.get<userCacheType>(userId);

            if (!user) {
                throw new BadGatewayException('User id not existed!');
            }

            const ok = await this.setToken(userId, publicKeyString);
            if (!ok) return;
            // send mail
            const userEmail = await this.getCaheUserEmail(userId);

            await this.emaiService.sendEmail(verifyToken, userId, userEmail);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async login(dto: LoginDto) {
        // get user from db
        const user = await this.getAuthenticatedUser(dto);
        // genergate access token and refresh token
        const tokens = await this.getTokenPairs(user.id, {
            email: user.email,
            role: ROLE.NORMAL,
            sub: user.id,
            username: user.username,
        });
        return {
            user,
            tokens,
        };
    }

    async getAuthenticatedUser({
        email,
        password,
    }: LoginDto): Promise<UserReponseType> {
        const user = await this.userService.findUnique(email);

        if (!user?.id) throw new BadRequestException("User doesn't existed!!");

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            throw new BadRequestException('Invalid password!');
        }
        delete user.password;
        return user;
    }

    private async getTokenPairs(
        userId: string,
        payload: TokenPayloadType,
    ): Promise<TokenPairType> {
        // genergate access token key pair
        const {
            privateKey: accessTokenPrivateKey,
            publicKey: accessTokenPublicKey,
        } = this.tokenService.generateKeyPairs();

        // genergate refresh token key pair
        const {
            privateKey: refreshTokenPrivateKey,
            publicKey: refreshTokenPublicKey,
        } = this.tokenService.generateKeyPairs();

        // using private key to genergate access token anh refresh token
        const accessToken = await this.tokenService.generateToken(
            payload,
            accessTokenPrivateKey,
            {
                type: TokenWithVerifyType.ACCESS_TOKEN,
            },
        );
        const refreshToken = await this.tokenService.generateToken(
            payload,
            refreshTokenPrivateKey,
            { type: TokenWithVerifyType.REFRESH_TOKEN },
        );

        const accessTokenPublicKeyString =
            this.tokenService.convertPublicKeyToString(accessTokenPublicKey);
        const refreshTokenPublicKeyString =
            this.tokenService.convertPublicKeyToString(refreshTokenPublicKey);

        await this.tokenService.saveToken(
            accessTokenPublicKeyString,
            userId,
            TokenType.ACCESS_TOKEN,
        );

        await this.tokenService.saveToken(
            refreshTokenPublicKeyString,
            userId,
            TokenType.REFRESH_TOKEN,
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}
