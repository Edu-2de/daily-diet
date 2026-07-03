import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../env';
import { PrismaClient } from '../generated/prisma/client';

// Pulo do gato 1: Tenta pegar a URL alterada pelo Vitest PRIMEIRO.
// Se não existir, pega a padrão validada pelo Zod.
const connectionString = process.env.DATABASE_URL || env.DATABASE_URL;

const pool = new Pool({ connectionString });

if (env.NODE_ENV === 'test') {
  const url = new URL(connectionString);
  const schema = url.searchParams.get('schema');

  if (schema) {
    pool.on('connect', (client) => {
      client
        .query(`SET search_path TO "${schema}", public`)
        .catch((err) => console.error('Erro ao setar o schema', err));
    });
  }
}

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});

export { prisma };
