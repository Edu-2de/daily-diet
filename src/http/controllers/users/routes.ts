import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { authenticate } from './authenticate';
import { getMealsMetrics } from './get-meals-metrics';
import { register } from './register';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
  app.get('/metrics', { onRequest: [verifyJWT] }, getMealsMetrics);
}
