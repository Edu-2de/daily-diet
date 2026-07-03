import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { UserNotFoundError } from './errors/user-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'john Doe',
      email: 'johnDoe@email.com',
      password: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johnDoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrongEmail@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
