import Router from "@koa/router";

import { user } from "../controllers";

const authorizedRouter = new Router();

authorizedRouter.post("/user", user.create);

export default authorizedRouter;
