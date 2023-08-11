import { z } from 'zod';
import { logger } from '.';

/**
 * Validates a given payload against a Zod schema.
 *
 * If the payload fails to validate against the schema,
 * it logs the error using our configured Winston logger.
 *
 * @template T The expected shape/type of the payload.
 *
 * @param {unknown} payload The data payload to validate.
 * @param {z.ZodSchema<T>} schema The Zod schema against which the payload will be validated.
 *
 * @returns {boolean} `true` if validation is successful, otherwise `false`.
 */
const validate = <T>(payload: unknown, schema: z.ZodSchema<T>): boolean => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    logger.error(result.error);
    return false;
  }
  return true;
};

export default validate;
