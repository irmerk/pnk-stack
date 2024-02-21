import jwt from "koa-jwt";
import { KOA } from "../config";

const authorize = jwt({
  secret: KOA.CONFIG.apiKey,
  getToken: (ctx) => {
    const auth = ctx.headers.authorization;
    if (auth && auth.split(" ")[0] === "Bearer") return auth.split(" ")[1];
    return null;
  },
});

export default authorize;
