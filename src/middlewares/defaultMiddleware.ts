import { INestApplication, INestMicroservice } from '@nestjs/common';
import configs, { ENVIRONMENT } from '../configs/configuration';

const isDev = configs.evironment === ENVIRONMENT.DEVELOPMENT;
const isProd = configs.evironment === ENVIRONMENT.PRODUCTION;

export default (app: INestMicroservice) => {
    if (isProd) {
        // middleware
        // app.user(compression());
        // app.use(helmet());
    }

    if (isDev) {
        // middeware for dev here
        // app.use(morgan('dev'));
    }

    // global middle ware
    // app.use(express.json());
};
