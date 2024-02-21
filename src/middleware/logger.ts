import * as winston from "winston";
import { StatusCodes } from "http-status-codes";
import { HttpError, Middleware, DefaultContext } from "koa";

import { Config } from "../interfaces";
import { LOGGER } from "../config";

/**
 * Koa middleware for logging HTTP requests and responses using the provided Winston logger.
 *
 * @function
 * @param {object} opts - The options for configuring the logger library.
 * @param {winston.Winston} opts.library - The Winston logger instance.
 * @returns {Middleware<Config.KoaMiddleware, DefaultContext, any>} - Koa middleware for logging.
 */
const logger = ({
  library,
}: {
  library: typeof winston;
}): Middleware<Config.KoaMiddleware, DefaultContext, any> => {
  const middlewareOutput: Middleware<Config.KoaMiddleware> = async (
    ctx,
    next
  ): Promise<void> => {
    const start = new Date().getTime();

    try {
      await next();
    } catch (err: unknown) {
      ctx.status =
        err instanceof HttpError
          ? err.status
          : StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = err instanceof Error ? err.message : "";
    }

    const ms = new Date().getTime() - start;

    let logLevel: (typeof LOGGER.OPTIONS)[keyof typeof LOGGER.OPTIONS];

    if (ctx.status >= StatusCodes.INTERNAL_SERVER_ERROR)
      logLevel = LOGGER.OPTIONS.ERROR;
    else if (ctx.status >= StatusCodes.BAD_REQUEST)
      logLevel = LOGGER.OPTIONS.WARN;
    else logLevel = LOGGER.OPTIONS.INFO;

    const message = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    library.log(logLevel, message);
  };

  return middlewareOutput;
};

export default logger;
