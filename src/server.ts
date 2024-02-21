/* Required External Modules */

import http from "http";
import Koa from "koa";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import { KOA, LOGGER, ENVIRONMENT } from "./config";
import * as router from "./routes";
import * as libraries from "./libraries";
import * as middleware from "./middleware";

/* Server Variables */

const app = new Koa();
const server = http.createServer(app.callback());

/* Server Configuration */

app.use(libraries.shutdown(server, { logger: libraries.logger }));

if (KOA.CONFIG.nodeEnv !== ENVIRONMENT.OPTIONS.TEST) {
  app.use(middleware.logger({ library: libraries.logger }));
}

app.on(LOGGER.OPTIONS.ERROR, libraries.sentry);

app
  .use(helmet()) // Provides important security headers to make your app more secure
  .use(cors()) // Enable cors with default options
  .use(bodyParser()) // Enable bodyParser with default options
  .use(middleware.errorHandler)
  .use(middleware.rateLimiter) // Enable an in-memory (or redis) rate limiter
  .use(router.unauthorized.routes())
  .use(router.unauthorized.allowedMethods()) // these routes ARE NOT protected by the JWT middleware
  .use(middleware.authorize)
  .use(router.authorized.routes())
  .use(router.authorized.allowedMethods()); // These routes ARE protected by the JWT middleware

/* Server Export */

export { app, server };
