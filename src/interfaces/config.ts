import type { BaseContext } from "koa";
import winston from "winston";

export interface KoaConfig {
  nodeEnv: string;
  port: number;
  debugLogging: boolean;
  apiKey: string;
}

export interface KoaMiddleware {
  ctx: BaseContext;
  next(): Promise<any>;
}

export interface ShutdownOptions {
  logger?: typeof console | typeof winston;
  forceTimeout?: number;
}
