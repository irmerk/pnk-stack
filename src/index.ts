/* Required External Modules */

import Koa from 'koa';
import http from 'http';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';

import config, { LOGGER_OPTIONS, ENVIRONMENTS } from './config';
import * as router from './routes';
import * as libraries from './libraries';
import * as middleware from './middleware';

/* Server Variables */

const app = new Koa();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(app.callback());

/* Server Configuration */

app.use(libraries.shutdown(server, { logger: libraries.logger }));

if (config.nodeEnv !== ENVIRONMENTS.TEST) app.use(middleware.logger(libraries.logger));

app.on(LOGGER_OPTIONS.ERROR, libraries.sentry);

app
  .use(helmet()) // Provides important security headers to make your app more secure
  .use(cors()) // Enable cors with default options
  .use(bodyParser()) // Enable bodyParser with default options
  .use(middleware.errorHandler)
  .use(middleware.rateLimiter) // Enable an in-memory (or redis) rate limiter
  .use(router.unauthorized.routes())
  .use(router.unauthorized.allowedMethods()) // these routes are NOT protected by the JWT middleware
  .use(jwt({ secret: config.jwt.accessTokenSecret })) // Below this only reached if JWT is valid
  .use(router.authorized.routes())
  .use(router.authorized.allowedMethods()); // These routes are protected by the JWT middleware

/* Server Activation */

try {
  server.listen(
    config.port,
    () => {
      console.log(`Server ready at http://localhost:${config.port}`);
    },
  );
} catch (err: unknown) {
  console.error('Failed to start HTTP server');
  console.error(err, (err instanceof Error && err.stack));
}

export default server;
