import { z } from "zod";

export const query = z.object({
  queryParam1: z.string(),
  queryParam2: z.string(),
});

const Alphanumeric13CharsRegex = /^[a-z0-9]{13}$/;
const uuidSchema = z
  .string()
  .regex(Alphanumeric13CharsRegex, {
    message: "Must be 13 pseudorandom alphanumeric characters, all lowercase",
  });

export const body = z.object({
  id: uuidSchema,
  account: z.object({
    uid: z.string(),
    email: z.string().optional(),
  }),
  metadata: z.object({
    createdAt: z.date().optional(),
  }),
});
