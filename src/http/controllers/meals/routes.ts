import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { deleteMeal } from './delete';
import { fetchMealById } from './fetch-by-id';

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/meals', create);
  app.delete('/meals/:id', deleteMeal);
  app.get('/meals/:id', fetchMealById);
}
