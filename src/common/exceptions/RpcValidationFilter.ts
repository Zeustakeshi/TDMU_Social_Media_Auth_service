import configs from '@/configs/configuration';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcValidationFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const error = exception.getError() as any;
        throw new RpcException({
            ...error,
            serviceName: configs.serviceName,
        });
    }
}
