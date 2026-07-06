import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '123456',
    });

    const response = await request(app.server)
      .post('/users/authenticate')
      .send({
        email: 'johnDoe@gmail.com',
        password: '123456',
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '123456',
    });

    const response = await request(app.server)
      .post('/users/authenticate')
      .send({
        email: 'johnDoe@gmail.com',
        password: '123423',
      });

    expect(response.statusCode).toEqual(500);
  });
});
