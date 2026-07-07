import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);
  app.post('/meals', create);
}
