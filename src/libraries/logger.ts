import winston from "winston";

import { ENVIRONMENT, LOGGER, KOA } from "../config";

/**
 * Custom format function for the Winston logger. This function formats log messages
 * based on various properties of the log data. If an error object is provided,
 * it logs out the stack trace. In non-production environments, it also logs
 * the error itself.
 *
 * More details: https://github.com/winstonjs/winston/issues/1338#issuecomment-506354691
 *
 * @param {winston.Logform.TransformableInfo} info - The log information.
 * @returns {string} - Formatted log message.
 */
const myFormat = winston.format.printf(
  (info: winston.Logform.TransformableInfo) => {
    const {
      timestamp: tmsmp,
      level,
      message,
      status,
      data,
      error,
      ...rest
    } = info;

    let log = `${tmsmp} - ${level}:\n${message}`;

    if (status || data) {
      log = `${log}\n${JSON.stringify({ status, data }, undefined, 2)}`;
      return log;
    }
    if (error instanceof Error) {
      if (error.stack) log = `${log}\n${error.stack}`;

      if (process.env.NODE_ENV !== ENVIRONMENT.OPTIONS.PROD) {
        log = `${log}\n${JSON.stringify(error, undefined, 2)}`;
      }
    }

    if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
      log = `${log}\n${JSON.stringify(rest, undefined, 2)}`;
    }

    return log;
  }
);

/**
 * Transports define the medium to output the log information.
 * This configuration contains a console transport with custom formatting.
 *
 * @constant
 * @type {winston.transport[]}
 * @property {winston.transports.Console} - A Winston Console transport instance.
 * @property {boolean} handleExceptions - Determines if exceptions will be logged in this transport.
 * Set to `false` to prevent exception logging.
 * @property {winston.Format} format - The format in which logs should be outputted.
 * This combines colorizing logs and a simple log format.
 * @property {boolean} silent - Silences the log output when the app is in 'test' environment.
 */
const transports = [
  new winston.transports.Console({
    handleExceptions: false,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    silent: process.env.NODE_ENV === ENVIRONMENT.OPTIONS.TEST,
  }),
];

/**
 * Configures the Winston logger based on the given environment and settings.
 * - Uses either 'debug' or 'info' log level depending on the `debugLogging` config.
 * - Logs to the console with specific formatting.
 */
winston.configure({
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  level: KOA.CONFIG.debugLogging ? LOGGER.OPTIONS.DEBUG : LOGGER.OPTIONS.INFO,
  transports,
});

const logger = winston;

export default logger;
