import winston from 'winston';
import { Middleware } from 'koa';
import { Server as httpServer } from 'http';

import { KoaMiddleware } from '../interfaces';
import { ENVIRONMENTS } from '../config';

interface Options {
  logger?: typeof console | typeof winston;
  forceTimeout?: number;
}

/* Gracefully shutdown the application when requested, rejecting any requests that come through. */

const createShutdownMiddleware = (server: httpServer, opts: Options) => {
  const logger = opts.logger ?? console; // Defaults to console
  const forceTimeout = typeof opts.forceTimeout === 'number'
    ? opts.forceTimeout
    : (30 * 1000); // Defaults to 30s

  let shuttingDown = false;

  process.on('SIGTERM', () => {
    if (shuttingDown) return; // We already know we're shutting down, don't continue this function
    if (!process.env.NODE_ENV || process.env.NODE_ENV === ENVIRONMENTS.DEV) {
      process.exit(0); // Don't bother with graceful shutdown in development
    }
    shuttingDown = true;

    logger.warn('Received kill signal (SIGTERM), shutting down...');

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, forceTimeout);

    server.close(() => {
      logger.info('Closed out remaining connections');
      process.exit(0);
    });
  });

  const middlewareOutput: Middleware<KoaMiddleware> = (ctx, next): Promise<unknown> | void => {
    if (shuttingDown) {
      ctx.status = 503;
      ctx.body = 'Server is in the process of shutting down';
      ctx.set('Connection', 'close');
    } else {
      return next();
    }
  };

  return middlewareOutput;
};

export default createShutdownMiddleware;
