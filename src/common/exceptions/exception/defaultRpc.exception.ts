import configs from '@/configs/configuration';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

type DefaultRpcExecptionParams = {
    error?: string;
    status?: HttpStatus;
    mess?: string;
};

export default class DefaultRpcExecption extends RpcException {
    constructor(data?: DefaultRpcExecptionParams) {
        super({
            status: data?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            mess: data?.mess || 'no-mess',
            serviceName: configs.serviceName,
            body: {
                data: null,
                error: data?.error || 'unknow error!',
            },
        });
    }
}
