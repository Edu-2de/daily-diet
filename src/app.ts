import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import z, { ZodError } from 'zod';
import { env } from './env';
import { mealsRoutes } from './http/controllers/meals/routes';
import { usersRoutes } from './http/controllers/users/routes';

export const app = fastify();

app.register(usersRoutes);
app.register(mealsRoutes);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
