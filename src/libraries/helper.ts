import { ParameterizedContext } from "koa";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { Config } from "../interfaces";

/**
 * Sets a successful 201 Created response on the provided Koa context.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext<Config.KoaMiddleware>} opts.ctx - The Koa context
 * to set the response on.
 * @param {unknown} [opts.data] - Optional data to include in the response.
 */
export const setCreatedResponse = ({
  ctx,
  data,
}: {
  ctx: ParameterizedContext<Config.KoaMiddleware>;
  data?: unknown;
}) => {
  ctx.status = StatusCodes.CREATED;
  ctx.body = {
    success: true,
    message: ReasonPhrases.CREATED,
    data,
  };
};
