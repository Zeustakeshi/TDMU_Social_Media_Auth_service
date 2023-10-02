import { HttpStatus } from '@nestjs/common';

export interface ServiceResponseType {
    status: HttpStatus;
    mess: string;
    serviceName: string;
    body: {
        data: any;
        error: string | null;
    };
}
