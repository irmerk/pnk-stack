import * as winston from 'winston';
import { HttpError, Middleware, DefaultContext } from 'koa';

import { Config } from '../interfaces';
import { LOGGER_OPTIONS } from '../config';

/**
 * Koa middleware for logging HTTP requests and responses using the provided Winston logger.
 *
 * @param {winston.Winston} winstonInstance - The Winston logger instance.
 * @returns {Middleware<Config.KoaMiddleware, DefaultContext, any>} - Koa middleware for logging.
 */
const logger = (
  winstonInstance: typeof winston,
): Middleware<Config.KoaMiddleware, DefaultContext, any> => {
  const middlewareOutput: Middleware<Config.KoaMiddleware> = async (ctx, next): Promise<void> => {
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
