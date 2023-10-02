import { RegisterDto } from '@/modules/auth/dtos';
import { ROLE } from '@/common/enums';
import configs from '@/configs/configuration';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { IUserService } from './user.service.interface';
import DefaultRpcExecption from '@/common/exceptions/exception/defaultRpc.exception';

@Injectable()
export class UserService implements IUserService {
    private baseUrl = configs.userServiceHost;
    constructor() {}

    // async getAll() {
    //     return await this.prisma.users.findMany();
    // }

    async findUnique(identity: string) {
        try {
            const res = await axios({
                method: 'GET',
                url: `${this.baseUrl}/search`,
                params: {
                    keyword: identity,
                },
            });

            return res.data.body.data;
        } catch (error) {
            const errorResponse = error?.response?.data;
            throw new DefaultRpcExecption({
                error: errorResponse?.body?.error,
                status: errorResponse?.status,
                mess: errorResponse?.mess,
            });
        }
    }

    async isExisted(identity: string) {
        try {
            const user = await this.findUnique(identity);
            return user !== null;
        } catch (error: any) {
            return false;
        }
        // try {
        //     const res = await axios({
        //         method: 'POST',
        //         url: `${this.baseUrl}/exist`,
        //         // data: {
        //         //     email,
        //         // },
        //     });
        //     return res.data.body.data;
        // } catch (error) {
        //     throw new RpcException(error?.response?.data);
        // }
    }

    async register(user: RegisterDto) {
        // save user to database
        // const newUser = await this.prisma.users.create({
        //     data: {
        //         username: user.username,
        //         birthday: user.birthday,
        //         email: user.email,
        //         gender: user.gender,
        //         password: user.password,
        //         role: ROLE.NORMAL,
        //     },
        // });
        // delete newUser.password;
        try {
            const res = await axios({
                method: 'POST',
                url: `${this.baseUrl}/register`,
                data: {
                    username: user.username,
                    birthday: user.birthday,
                    email: user.email,
                    gender: user.gender,
                    password: user.password,
                    role: ROLE.NORMAL,
                },
            });
            return res.data.body.data;
        } catch (error) {
            if (error?.response?.data) {
                throw new RpcException(error.response.data);
            }
            throw new DefaultRpcExecption({
                error: error.message,
                status: HttpStatus.BAD_GATEWAY,
            });
        }
    }

    async getUserInfo(identity: string) {
        const user = await this.findUnique(identity);
        const { password, ...userResponse } = user;
        return userResponse;
    }
}
