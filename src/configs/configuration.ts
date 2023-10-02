import * as dotenv from 'dotenv';
export enum ENVIRONMENT {
    PRODUCTION = 'PRODUCTION',
    DEVELOPMENT = 'DEVELOPMENT',
    TESTTING = 'TESTTING',
}

dotenv.config();

const devConfigs = {};
const productConfigs = {};
const testConfigs = {};

const getConfig = () => {
    const envType = process.env.NODE_ENV;
    switch (envType) {
        case ENVIRONMENT.PRODUCTION:
            return productConfigs;
        case ENVIRONMENT.DEVELOPMENT:
            return devConfigs;
        case ENVIRONMENT.TESTTING:
            return testConfigs;
        default:
            break;
    }
};

interface ConfigType {
    serviceName: string;
    userServiceHost: string;
    accessTokenExpiresTime: string;
    refreshTokenExpiresTime: string;
    verifyTokenExpiresTime: string;
    mailHost: string;
    mailUser: string;
    mailPass: string;
    mailFrom: string;
    mailVerifyUrl: string;
    cacheUserReigsterTTL: number;
    cacheDbURL: string;
    evironment: keyof typeof ENVIRONMENT;
    port: number;
    database: {
        URL: string;
    };
}

const configs = {
    ...getConfig(),
    userServiceHost: process.env.USER_SERVICE_URL_HOST,
    evironment: process.env.NODE_ENV,
    serviceName: process.env.SERVICE_NAME,
    port: parseInt(process.env.PORT, 10),
    accessTokenExpiresTime: process.env.ACCESS_TOKEN_EXPIRES_TIME || '5m',
    refreshTokenExpiresTime: process.env.REFRESH_TOKEN_EXPIRES_TIME || '2h',
    verifyTokenExpiresTime: process.env.VERIFY_TOKEN_EXPIRES_TIME || '10s',
    mailHost: process.env.MAIL_HOST,
    mailUser: process.env.MAIL_USER,
    mailFrom: process.env.MAIL_FROM,
    mailPass: process.env.MAIL_PASS,
    mailVerifyUrl: process.env.MAIL_VERIFY_URL,
    cacheUserReigsterTTL: parseInt(process.env.CACHE_USER_REGISTER_TTL),
    cacheDbURL: process.env.CACHE_DB_URL,
    database: {
        URL: process.env.DATABASE_URL || process.env.DB_URI,
    },
} as ConfigType;
export default configs;
