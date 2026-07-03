import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  NODE_ENV: z.string().default('dev'),
  JWT_SECRET: z.string(),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    z.treeifyError(_env.error),
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
