import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('auth-register')
    async register(@Body() dto: RegisterDto) {
        const userId = await this.authService.cacheUser(dto);
        return {
            userId,
        };
    }

    @MessagePattern('auth-register-send-mail-verify')
    async registerSendMailVerify(@Body() { userId }: { userId: string }) {
        await this.authService.registerSendMailVerify(userId);
        return {
            mess: 'ok',
        };
    }

    @MessagePattern('auth-register-verify-token')
    async registerVeifyToken(
        @Body() { token, userId }: { token: string; userId: string },
    ) {
        if (!token) throw new BadRequestException();
        const data = await this.authService.register(token, userId);
        return {
            status: HttpStatus.CREATED,
            ...data,
        };
    }

    @MessagePattern('auth-login')
    async login(@Body() dto: LoginDto) {
        const data = await this.authService.login(dto);
        return data;
    }
}
