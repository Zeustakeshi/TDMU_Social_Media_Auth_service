import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import DefaultRpcExecption from './exception/defaultRpc.exception';

@Catch(HttpException)
export class HttpValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        throw new DefaultRpcExecption({
            error: exception.message,
            status: exception.getStatus(),
            mess: exception.message,
        });
    }
}
