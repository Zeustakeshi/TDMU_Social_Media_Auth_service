import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import configs from './configs/configuration';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { TokenModule } from './modules/token/token.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath:
                configs.evironment === 'DEVELOPMENT' ? '.env.dev' : '.env',
        }),
        CacheModule.register({
            isGlobal: true,
            store: redisStore.create({
                url: configs.cacheDbURL,
            }),
        }),
        AuthModule,
        PrismaModule,
        UserModule,
        EmailModule,
        TokenModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {}
}
