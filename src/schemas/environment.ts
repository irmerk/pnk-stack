import { z } from "zod";

const schema = z.object({
  API_KEY_SELF: z.string(), // Personal Access Token for incoming API calls to this service
});


/**
 * Validating the environment variables against the schema
 */
const parse = schema.safeParse(process.env);

/**
 * If validation fails, throw an error with the pertinent messages
 */
if (!parse.success) {
  throw new Error(
    `Environment validation failed: ${JSON.stringify(parse.error.message)}`
  );
}

const { data } = parse;

/**
 * Making this object readonly adds a small degree of compile-time anti-pollution
 * safety. (Makes it easier to notice if code elsewhere attempts to modify global
 * configuration values.)
 */
export const safe: Readonly<z.infer<typeof schema>> = data;
