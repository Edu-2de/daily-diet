import type { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createMeal(app: FastifyInstance, token: string) {
  const mealResponse = await request(app.server)
    .post('/meals')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'name',
      description: 'description',
      date: '07/07/2026',
      onDiet: true,
    });

  const { meal } = mealResponse.body;

  return { meal };
}
