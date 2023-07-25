import * as winston from 'winston';
import { HttpError, Middleware, DefaultContext } from 'koa';

import { KoaMiddleware } from '../interfaces';
import { LOGGER_OPTIONS } from '../config';

const logger = (
  winstonInstance: typeof winston,
): Middleware<KoaMiddleware, DefaultContext, any> => {
  const middlewareOutput: Middleware<KoaMiddleware> = async (ctx, next): Promise<void> => {
    const start = new Date().getTime();

    try {
      await next();
    } catch (error: unknown) {
      ctx.status = error instanceof HttpError ? error.status : 500;
      ctx.body = error instanceof Error ? error.message : '';
    }

    const ms = new Date().getTime() - start;

    let logLevel: typeof LOGGER_OPTIONS[keyof typeof LOGGER_OPTIONS];

    if (ctx.status >= 500) logLevel = LOGGER_OPTIONS.ERROR;
    else if (ctx.status >= 400) logLevel = LOGGER_OPTIONS.WARN;
    else logLevel = LOGGER_OPTIONS.INFO;

    const message = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    winstonInstance.log(logLevel, message);
  };

  return middlewareOutput;
};

export default logger;
