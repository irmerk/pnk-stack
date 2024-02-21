import { ENVIRONMENT } from ".";
import { Config } from "../interfaces";
import * as schema from "../schemas";

const isDevelopmentMode = process.env.NODE_ENV === ENVIRONMENT.OPTIONS.DEV;

export const CONFIG: Config.KoaConfig = {
  nodeEnv: process.env.NODE_ENV || ENVIRONMENT.OPTIONS.DEV,
  port: +(process.env.PORT || 3000),
  debugLogging: isDevelopmentMode,
  apiKey: schema.environment.safe.API_KEY_SELF || "MOCK_API_KEY",
};
