import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John DOe',
      email: 'johnDoe@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John DOe',
      email: 'johnDoe@gmail.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password);

    expect(isPasswordCorrectlyHashed).toBeTruthy();
  });

  it('should not be able to register same email twice', async () => {
    const email = 'johnDoe@gmail.com';

    await sut.execute({
      name: 'John DOe',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'John DOe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
