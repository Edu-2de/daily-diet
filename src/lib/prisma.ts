import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../env';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL || env.DATABASE_URL;

const schema = new URL(connectionString).searchParams.get('schema');

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool, schema ? { schema } : undefined);

const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});

export { prisma };
