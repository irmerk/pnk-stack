import { Middleware } from 'koa';

import { KoaMiddleware } from '../interfaces';

export const customEndpoint: Middleware<KoaMiddleware> = (ctx) => {
  ctx.body = 'Success!';
  ctx.status = 201;
};
