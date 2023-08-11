import { AxiosError } from 'axios';
import { Prisma } from '@prisma/client';

type PrismaError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientValidationError;

export type Any = AxiosError | PrismaError | Error | any;
