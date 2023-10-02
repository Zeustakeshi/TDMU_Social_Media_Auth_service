import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenController } from './token.controller';

@Global()
@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [TokenController],
    providers: [TokenService, JwtService],
    exports: [TokenService],
})
export class TokenModule {}
