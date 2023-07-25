import Router from '@koa/router';

import { custom } from '../controllers';

const customRouter = new Router();

customRouter.get('/custom', custom.customEndpoint);

export default customRouter;
