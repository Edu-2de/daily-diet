import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe('Create Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a meal', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '123456',
    });

    const firstResponse = await request(app.server)
      .post('/users/authenticate')
      .send({
        email: 'johnDoe@gmail.com',
        password: '123456',
      });

    const { token } = firstResponse.body;

    const response = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'name',
        description: 'description',
        date: '07/07/2026',
        onDiet: true,
      });

    expect(response.statusCode).toEqual(201);
  });
});
