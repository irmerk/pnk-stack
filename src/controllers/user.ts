import axios from "axios";
import { Middleware, ParameterizedContext } from "koa";

import { helper, prisma } from "../libraries";
import { Config, Users } from "../interfaces";
import * as schema from "../schemas";

/**
 * Koa middleware to handle user creation.
 * This route will validate the incoming user info, process the data,
 * and store the relevant record details in an external source and Prisma.
 *
 * @function create
 * @type {Middleware<Config.KoaMiddleware>}
 * @async
 *
 * @param {ParameterizedContext<Config.KoaMiddleware>} ctx - Koa context.
 *
 * @returns {Promise<void>} Returns nothing but will set the Koa context body and status.
 *
 * @throws {Error} If validation fails, creation to the external source fails, or
 * Prisma record creation fails.
 */
export const create: Middleware<Config.KoaMiddleware> = async (
  ctx: ParameterizedContext<Config.KoaMiddleware>
) => {
  const { id, account, metadata } = schema.user.body.parse(ctx.request.body);

  const config = {
    url: "https://some.external.url/",
    headers: {
      Authorization: "Bearer <EXTERNAL_API_KEY>",
      "Content-Type": "application/json",
    },
    fields: {
      id,
      email: account.email,
      ...metadata,
    },
  };

  const {
    data: { id: externalRecordId },
  } = await axios.post<Users.ExternalRecordResponse>(
    config.url,
    { fields: config.fields },
    { headers: config.headers }
  );

  await prisma.user.create({
    data: {
      externalRecordId,
    },
  });

  helper.setCreatedResponse({ ctx });
};
