import * as Sentry from '@sentry/node';

import { dsn } from '../config';

Sentry.init({ dsn });

const sentryHandler = (err: any, ctx: any) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => Sentry.addRequestDataToEvent(event, ctx.request));
    Sentry.captureException(err);
  });
};

export default sentryHandler;
