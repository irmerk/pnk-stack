import { DefaultContext } from "koa";
import * as Sentry from "@sentry/node";

import { SENTRY } from "../config";

Sentry.init({ dsn: SENTRY.dsn });

/**
 * Handles errors by reporting them to Sentry with relevant context information.
 *
 * The function captures exceptions and sends them to Sentry while attaching
 * request data from the Koa context for better error diagnostics.
 *
 * @function
 * @param {DefaultContext} ctx - The Koa context object containing request details.
 * @param {unknown} err - The error object to be reported.
 */
const sentryHandler = (ctx: DefaultContext, err: unknown) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) =>
      Sentry.addRequestDataToEvent(event, ctx.request)
    );
    Sentry.captureException(err);
  });
};

export default sentryHandler;
