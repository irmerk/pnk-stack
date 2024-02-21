import { server } from "./server";
import { KOA } from "./config";

/* Server Activation */

try {
  server.listen(KOA.CONFIG.port, () => {
    console.log(`Server ready at http://localhost:${KOA.CONFIG.port}`);
  });
} catch (err: unknown) {
  console.error("Failed to start HTTP server");
  console.error(err, err instanceof Error && err.stack);
}
