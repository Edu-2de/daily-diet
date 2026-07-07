import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user';

describe('Fetch Many Meals By User (e2e) ', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to fetch many user meals', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await Promise.all([
      request(app.server)
        .post('/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'name',
          description: 'description',
          date: '07/07/2026',
          onDiet: true,
        }),

      request(app.server)
        .post('/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'name2',
          description: 'description2',
          date: '09/07/2026',
          onDiet: true,
        }),
    ]);

    const response = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { meals } = response.body;

    expect(response.statusCode).toBe(200);
    expect(meals).toHaveLength(2);
    expect(meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'name',
          description: 'description',
          onDiet: true,
        }),
        expect.objectContaining({
          name: 'name2',
          description: 'description2',
          onDiet: true,
        }),
      ]),
    );
  });
});
