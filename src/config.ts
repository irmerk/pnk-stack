import dotenv from 'dotenv';

import { Config } from './interfaces';

dotenv.config({ path: '.env' });

export const dsn = '<DSN_FROM_SENTRY>';

export const ENVIRONMENTS = {
  TEST: 'test',
  DEV: 'development',
  STAGE: 'staging',
  PROD: 'production',
};

export const LOGGER_OPTIONS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

const isDevelopmentMode = process.env.NODE_ENV === ENVIRONMENTS.DEV;

const config: Config = {
  nodeEnv: process.env.NODE_ENV || ENVIRONMENTS.DEV,
  port: +(process.env.PORT || 3000),
  debugLogging: isDevelopmentMode,
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-secret-whatever',
    accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-whatever',
    refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE || '24h',
  },
};

export default config;
