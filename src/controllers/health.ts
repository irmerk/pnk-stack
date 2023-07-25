import axios from 'axios';
import { Middleware } from 'koa';
import type { AxiosResponse } from 'axios';
import type { BaseContext } from 'koa';

export interface KoaMiddleware {
  ctx: BaseContext;
  next(): Promise<any>;
}

interface CatFactResponse {
  fact: string;
  length: number;
}

export const status: Middleware<KoaMiddleware> = async (ctx) => {
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
