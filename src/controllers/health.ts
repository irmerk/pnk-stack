import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { Middleware, ParameterizedContext } from 'koa';

import { validate } from '../libraries';
import { Config } from '../interfaces';
import * as schema from '../schemas';

interface CatFactResponse {
  fact: string;
  length: number;
}

/**
 * Koa middleware for a health check endpoint.
 * This route provides basic details about the server's status and health.
 * Typically used for monitoring and uptime checks.
 *
 * @function status
 * @async
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
 *   "catFact": {
 *      "fact": "Some random fact"
 *      "length": 2
 *   }
 * }
 */
export const status: Middleware<Config.KoaMiddleware> = async (
  ctx: ParameterizedContext<Config.KoaMiddleware>,
) => {
  // Right now these validate arbitrary things against a random schema, so this should be customized.
  validate(ctx.request.body, schema.health.body);
  validate(ctx.request.query, schema.health.query);

  const config = {
    method: 'get',
    url: 'https://catfact.ninja/fact',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { data } = await axios<AxiosResponse<CatFactResponse>>(config);

  ctx.response.body = {
    timestamp: Date.now(),
    uptime: process.uptime(),
    message: 'OK',
    catFact: data,
  };
};
