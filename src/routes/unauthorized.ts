import Router from "@koa/router";

import { health } from "../controllers";

const unauthorizedRouter = new Router();

unauthorizedRouter.get("/health", health.status);

export default unauthorizedRouter;
