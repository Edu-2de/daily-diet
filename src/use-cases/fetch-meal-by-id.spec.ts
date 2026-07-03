import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { FetchMealByIdUseCase } from './fetch-meal-by-id';

let usersRepository: InMemoryUsersRepository;
let mealsRepository: InMemoryMealsRepository;
let sut: FetchMealByIdUseCase;

describe('Fetch Meal By Id Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();

    sut = new FetchMealByIdUseCase(mealsRepository);
  });

  it('should be able to get a meal using your id ', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: await hash('123456', 8),
    });

    const meal = await mealsRepository.create({
      userId: user.id,
      name: 'title',
      description: 'description',
      date: new Date(),
      onDiet: false,
    });

    const response = await sut.execute({
      mealId: meal.id,
      userId: user.id,
    });

    expect(response.meal.userId).toEqual(user.id);
  });

  it('should not be able to an user get a meal from another user', async () => {
    const meal = await mealsRepository.create({
      userId: randomUUID(),
      name: 'title',
      description: 'description',
      date: new Date(),
      onDiet: false,
    });

    await expect(() =>
      sut.execute({
        mealId: meal.id,
        userId: 'user-wrong',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
