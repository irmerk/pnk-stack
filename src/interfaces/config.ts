import type { BaseContext } from 'koa';
import winston from 'winston';

interface JwtSecrets {
    accessTokenSecret: string;
    accessTokenLife: string;
    refreshTokenSecret: string;
    refreshTokenLife: string;
}

export interface Config {
    nodeEnv: string;
    port: number;
    debugLogging: boolean;
    jwt: JwtSecrets;
}

export interface KoaMiddleware {
    ctx: BaseContext;
    next(): Promise<any>;
}

export interface ShutdownOptions {
    logger?: typeof console | typeof winston;
    forceTimeout?: number;
}
