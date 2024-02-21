import { Middleware, ParameterizedContext } from "koa";

import { Config } from "../interfaces";

/**
 * Koa middleware for a health check endpoint.
 * This route provides basic details about the server's status and health.
 * Typically used for monitoring and uptime checks.
 *
 * @function status
 * @type {Middleware<Config.KoaMiddleware>}
 *
 * @param {ParameterizedContext<Config.KoaMiddleware>} ctx - Koa context.
 *
 * @returns {void} Sets the Koa context response body with the server's current status information.
 *
 * Response example:
 * {
 *   "timestamp": 1627988479169,
 *   "uptime": 345.6789,
 *   "message": "OK"
 * }
 */
export const status: Middleware<Config.KoaMiddleware> = (
  ctx: ParameterizedContext<Config.KoaMiddleware>
) => {
  ctx.response.body = {
    timestamp: Date.now(),
    uptime: process.uptime(),
    message: "OK",
  };
};
