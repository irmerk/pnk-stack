import { Middleware } from 'koa';
import createError from 'http-errors';

import { KoaMiddleware, CtxError } from '../interfaces';
import { logger } from '../libraries';

const registerServerError = ({ ctx, error }: CtxError) => {
  ctx.status = 500;
  ctx.statusCode = 500;
  logger.error(error);
};

const handleErrorHeaders = ({ ctx, error }: CtxError) => {
  const { headers } = error;
  if (!headers) return;
  Object.keys(headers).forEach((name) => {
    ctx.set(name, headers[name]);
  });
};

const errorHandler: Middleware<KoaMiddleware> = async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    const error = createError(err);
    if (!error.status || !error.statusCode) registerServerError({ ctx, error });
    if (error.statusCode >= 500) logger.error(error);
    if (error.headers) handleErrorHeaders({ ctx, error });

    ctx.body = error.statusCode < 500 || error.expose ? error : createError(error.status);
    ctx.app.emit('error', error, ctx);
    ctx.status = error.status as number;
    ctx.statusCode = error.statusCode as number;
  }
};

export default errorHandler;
