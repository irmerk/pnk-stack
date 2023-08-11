import ratelimit from 'koa-ratelimit';

const database = new Map(); // in memory db

/**
 * Koa middleware to limit the rate of incoming requests.
 * Uses in-memory storage to keep track of request rates.
 *
 * @function rateLimiter
 * @type {import('koa').Middleware}
 * @returns {import('koa').Middleware} A Koa middleware that
 * rate-limits incoming requests based on the client's IP address.
 */
const rateLimiter = ratelimit({
  driver: 'memory',
  db: database,
  duration: 60000, // duration to keep records of requests (in milliseconds)
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  /*
    Identifier function to determine the requester.
    Beware of using this in a proxy-enabled environment,
    as the IP might reflect the proxy's IP and not the end user's real IP.
  */
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining', // header for remaining requests
    reset: 'Rate-Limit-Reset', // header for when the rate limit resets
    total: 'Rate-Limit-Total', // header for total number of requests allowed
  },
  max: 100, // maximum number of allowed requests in duration
  disableHeader: false, // boolean to toggle adding rate-limit headers to responses
});

export default rateLimiter;
