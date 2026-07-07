import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user';
import { createMeal } from '../../../utils/test/create-meal';

describe('Edit Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able edit an meal', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const { meal } = await createMeal(app, token);

    const response = await request(app.server)
      .put(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'new Name',
      });

    expect(response.statusCode).toBe(204);
  });
});
