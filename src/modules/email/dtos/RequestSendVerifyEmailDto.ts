import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class RequestSendVerifyEmailDto {
    @IsUUID()
    userId: string;
}
