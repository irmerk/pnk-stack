import { ZodError } from "zod";
import { AxiosError } from "axios";
import { Prisma } from "@prisma/client";
import createError, { HttpError } from "http-errors";
import { Middleware, ParameterizedContext } from "koa";
import { StatusCodes } from "http-status-codes";

import { Config, Errors } from "../interfaces";
import { logger } from "../libraries";

/**
 * Registers a server error by logging the error and setting the context status to 500.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - The Koa context.
 * @param {HttpError} opts.err - The error to be logged.
 */
const registerServerError = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: HttpError;
}) => {
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  ctx.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  logger.error(err);
};

/**
 * If present, assigns headers from an error to the Koa context.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - The Koa context.
 * @param {HttpError} opts.err - The error from which headers are extracted.
 */
const handleErrorHeaders = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: HttpError;
}) => {
  const { headers } = err;
  if (!headers) return;
  Object.keys(headers).forEach((name) => {
    ctx.set(name, headers[name]);
  });
};

/**
 * Handle other types of HTTP errors.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - The Koa context.
 * @param {HttpError} opts.err - The HTTP error object.
 */
const handleOtherErrors = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: HttpError;
}) => {
  if (err.response?.status !== err.status) logger.error(err.response);
  if (!err.status || !err.statusCode) registerServerError({ ctx, err });
  if (err.headers) handleErrorHeaders({ ctx, err });
  if (err.statusCode >= (StatusCodes.INTERNAL_SERVER_ERROR as number))
    logger.error(err);
  // may need refactoring to not lose error messages below
  const message =
    err.statusCode < (StatusCodes.INTERNAL_SERVER_ERROR as number) || err.expose
      ? err
      : createError(err.status);
  ctx.status = err.status;
  ctx.statusCode = err.statusCode;
  ctx.body = {
    success: false,
    message,
    error: err,
  };
};

/**
 * Check if an error is an Axios error.
 *
 * @function
 * @param {any} err - The error to check.
 * @returns {boolean} - Returns true if the error is an Axios error, otherwise false.
 */
const isAxiosError = (err: any): err is AxiosError => "isAxiosError" in err;

/**
 * Handle Axios errors by logging and setting them to Koa context.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - The Koa context.
 * @param {AxiosError} opts.err - The Axios error.
 */
const handleAxiosErrors = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: AxiosError;
}) => {
  logger.error("Axios error occurred", {
    status: err.response?.status,
    data: err.response?.data,
  });
  ctx.body = err.response?.data;
  ctx.status = err.response?.status as number;
  ctx.statusCode = err.response?.status as number;
};

/**
 * Check if an error is one of Prisma's known errors.
 *
 * @function
 * @param {unknown} err - The error to check.
 * @returns {boolean} - Returns true if the error is a Prisma error, otherwise false.
 */
const isPrismaError = (err: unknown): boolean => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) return true;
  if (err instanceof Prisma.PrismaClientUnknownRequestError) return true;
  if (err instanceof Prisma.PrismaClientRustPanicError) return true;
  if (err instanceof Prisma.PrismaClientInitializationError) return true;
  if (err instanceof Prisma.PrismaClientValidationError) return true;
  return false;
};

/**
 * Handle Prisma errors by logging and setting them to Koa context.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - The Koa context.
 * @param {Errors.PrismaError} opts.err - The Prisma error.
 */
const handlePrismaErrors = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: Errors.PrismaError;
}) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error("PrismaClientKnownRequestError:", err.message);
    ctx.body = {
      error: err,
      message: "Known database error",
    };
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error("PrismaClientUnknownRequestError:", err.message);
    ctx.body = {
      error: err,
      message: "Unknown database error",
    };
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    logger.error("PrismaClientRustPanicError:", err.message);
    ctx.body = {
      error: err,
      message: "Internal database error due to Rust panic",
    };
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error("PrismaClientInitializationError:", err.message);
    ctx.body = {
      error: err,
      message: "Failed to initialize database",
    };
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error("PrismaClientValidationError:", err.message);
    ctx.body = {
      error: err,
      message: "Validation error on the database request",
    };
    ctx.status = StatusCodes.BAD_REQUEST;
  }
};

/**
 * Check if an error is an Zod error.
 *
 * @function
 * @param {unknown} err - The error to check.
 * @returns {boolean} - Returns true if the error is an Zod error, otherwise false.
 */
const isZodError = (err: unknown): boolean => err instanceof ZodError;

/**
 * Handles ZodErrors by setting the appropriate error message and status code.
 *
 * @function
 * @param {object} opts - The options for setting the response.
 * @param {ParameterizedContext} opts.ctx - Koa's context object.
 * @param {ZodError} opts.err - The ZodError instance.
 */
const handleZodErrors = ({
  ctx,
  err,
}: {
  ctx: ParameterizedContext;
  err: ZodError;
}) => {
  logger.error("Zod Validation Error:", err.message);
  ctx.body = {
    error: err,
    message: "Failed to validate",
  };
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
};

/**
 * Central error handling middleware for Koa.
 * This handles Axios, Prisma, Zod, and other types of errors.
 *
 * @async
 * @param {ParameterizedContext} ctx - The Koa context.
 * @param {Function} next - The next middleware function in Koa's middleware stack.
 */
const errorHandler: Middleware<Config.KoaMiddleware> = async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    if (err instanceof Error) {
      if (isZodError(err)) {
        handleZodErrors({ ctx, err: err as ZodError });
      } else if (isPrismaError(err)) {
        handlePrismaErrors({ ctx, err: err as Errors.PrismaError });
      } else if (isAxiosError(err)) {
        handleAxiosErrors({ ctx, err });
      } else {
        handleOtherErrors({ ctx, err: createError(err) });
      }
    } else {
      handleOtherErrors({ ctx, err: createError(err) });
    }
  }
};

export default errorHandler;
