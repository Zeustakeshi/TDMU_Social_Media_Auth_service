import configs from '@/configs/configuration';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export class ResponseFormatterInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return {
                    status: data.status || 200,
                    mess: 'ok',
                    serviceName: configs.serviceName,
                    body: {
                        data: data,
                        error: null,
                    },
                };
            }),
        );
    }
}
