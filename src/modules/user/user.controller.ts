import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '@/common/guards/token/accessToken.guard';
import { Roles } from '@/common/decorators';
import { ROLE } from '@/common/enums';
import { RolesGuard } from '@/common/guards/role.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern('user-get-info')
    async getUserInfo(@Body() identity: string) {
        return this.userService.getUserInfo(identity);
    }
}
