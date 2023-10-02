import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [TokenModule, UserModule, PassportModule, EmailModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        TokenService,
        UserService,
        LocalStrategy,
        EmailService,
    ],
})
export class AuthModule {}
