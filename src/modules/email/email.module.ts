import { AuthService } from '@/modules/auth/auth.service';
import configs from '@/configs/configuration';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        TokenModule,
        MailerModule.forRoot({
            transport: {
                host: configs.mailHost,
                auth: {
                    user: configs.mailUser,
                    pass: configs.mailPass,
                },
            },
            defaults: {
                from: `"No Reply ${configs.mailFrom}"`,
            },
        }),
    ],
    providers: [EmailService, TokenService, AuthService, UserService],
})
export class EmailModule {}
