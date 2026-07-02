import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import type { MealsRepository } from '../repositories/meals-repository';
import type { UsersRepository } from '../repositories/users-repository';
import { CreateMealUseCase } from './create-meal';

describe('Create Meal Use Case', () => {
  let usersRepository: UsersRepository;
  let mealsRepository: MealsRepository;

  let sut: CreateMealUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    sut = new CreateMealUseCase(mealsRepository, usersRepository);
  });

  it('should be able an user create a meal', async () => {
    const user = await usersRepository.register({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: '123456',
    });

    const response = await sut.execute({
      name: 'test',
      description: 'description',
      onDiet: false,
      userId: user.id,
      date: new Date(),
    });

    expect(response.meal).toEqual(
      expect.objectContaining({
        name: 'test',
        description: 'description',
        onDiet: false,
        userId: user.id,
      }),
    );
  });
});
