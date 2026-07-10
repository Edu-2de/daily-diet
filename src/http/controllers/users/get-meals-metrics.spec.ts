import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user';
import { createMeal } from '../../../utils/test/create-meal';

describe('Get Meals Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to an user get your own meals metrics', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const { meal } = await createMeal(app, token);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'name2',
        description: 'description2',
        date: '07/07/2026',
        onDiet: true,
      });

    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.statusCode).toBe(200);
  });
});
