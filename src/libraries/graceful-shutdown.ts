import { Server as httpServer } from 'http';
import { Middleware } from 'koa';

import { Config } from '../interfaces';
import { ENVIRONMENTS } from '../config';

/**
 * Gracefully shuts down the application when requested, rejecting any new incoming requests.
 * If the server doesn't close all connections within the provided timeout (or default 30s),
 * it will forcefully shut down.
 *
 * @param {httpServer} server - The HTTP server instance to be managed.
 * @param {Config.ShutdownOptions} opts - Configuration options for the shutdown process.
 * @returns {Middleware<Config.KoaMiddleware>} Koa middleware which responds with a 503
 * status code if the server is shutting down.
 */
const createShutdownMiddleware = (
  server: httpServer,
  opts: Config.ShutdownOptions,
): Middleware<Config.KoaMiddleware> => {
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

  // eslint-disable-next-line consistent-return, max-len
  const middlewareOutput: Middleware<Config.KoaMiddleware> = (ctx, next): Promise<unknown> | void => {
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
