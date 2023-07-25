import type { BaseContext } from 'koa';
import { ParameterizedContext, DefaultContext } from 'koa';
import { HttpError } from 'http-errors';

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

export interface CtxError {
    ctx: ParameterizedContext<KoaMiddleware, DefaultContext, any>;
    error: HttpError;
}
