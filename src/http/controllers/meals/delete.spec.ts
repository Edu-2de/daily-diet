import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user';
import { createMeal } from '../../../utils/test/create-meal';

describe('Delete Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to a user delete your own meal', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const { meal } = await createMeal(app, token);

    const response = await request(app.server)
      .delete(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
  });
});
