import ratelimit from 'koa-ratelimit';

const database = new Map(); // in memory db

const rateLimiter = ratelimit({
  driver: 'memory',
  db: database,
  duration: 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  /*
    This may be the proxy and not the actual IP, because
    user IP might be in different header due to CloudFlare
  */
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  max: 100,
  disableHeader: false,
});

export default rateLimiter;
