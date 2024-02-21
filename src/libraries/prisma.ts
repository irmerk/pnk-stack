import { PrismaClient } from "@prisma/client";

/**
 * The Prisma ORM client instance.
 *
 * Provides access to the database as defined in the prisma/schema.prisma file.
 * With this client, one can perform CRUD operations on the PostgreSQL database
 * using the Prisma ORM.
 */
const prisma = new PrismaClient();

export default prisma;
