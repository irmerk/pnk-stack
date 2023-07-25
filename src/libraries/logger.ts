import winston from 'winston';

import config, { ENVIRONMENTS, LOGGER_OPTIONS } from '../config';

/**
 * Custom format function that will look for an error object and
 * log out the stack and if its not production, the error itself
 * https://github.com/winstonjs/winston/issues/1338#issuecomment-506354691
 */
const myFormat = winston.format.printf((info) => {
  const {
    timestamp: tmsmp,
    level,
    message,
    error,
    ...rest
  } = info;

  let log = `${tmsmp} - ${level}:\t${message}`;

  if (error instanceof Error) {
    if (error.stack) {
      log = `${log}\n${error.stack}`;
    }

    if (process.env.NODE_ENV !== ENVIRONMENTS.PROD) {
      log = `${log}\n${JSON.stringify(error, undefined, 2)}`;
    }
  }

  if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
    log = `${log}\n${JSON.stringify(rest, undefined, 2)}`;
  }

  return log;
});

winston.configure({
  level: config.debugLogging ? LOGGER_OPTIONS.DEBUG : LOGGER_OPTIONS.INFO,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
  format: winston.format.combine(winston.format.timestamp(), myFormat),
});

const logger = winston;

export default logger;
