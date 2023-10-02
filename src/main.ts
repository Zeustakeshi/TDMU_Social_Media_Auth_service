import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import defaultMiddleware from './middlewares/defaultMiddleware';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configs from './configs/configuration';
import { RpcValidationFilter } from './common/exceptions/RpcValidationFilter';
import { ResponseFormatterInterceptor } from './common/interceptors/responseFormater.interceptor';
import { HttpValidationFilter } from './common/exceptions/HttpValidationFilter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                port: configs.port,
            },
        },
    );

    // use middleware
    defaultMiddleware(app);

    // global pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new HttpValidationFilter());
    app.useGlobalInterceptors(new ResponseFormatterInterceptor());

    await app.listen();
    console.log(
        `Service: ${configs.serviceName}  
        |--- Port: ${configs.port}
        |--- Running on ${configs.evironment}
        |--- Make something great! 😇`,
    );
}
bootstrap();
