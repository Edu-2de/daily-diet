import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { EditMealUseCase } from './edit-meal';
import { MealNotFoundError } from './errors/meal-not-found';
import { NotAllowedError } from './errors/not-allowed-error';

let usersRepository: InMemoryUsersRepository;
let mealsRepository: InMemoryMealsRepository;
let sut: EditMealUseCase;

describe('Edit Meal Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    sut = new EditMealUseCase(mealsRepository);
  });

  it('should be able an user edit your own meal', async () => {
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

    const result = await sut.execute({
      mealId: meal.id,
      userId: user.id,
      name: 'new Title',
    });

    expect(result.meal.name).toEqual('new Title');
  });

  it('should not be able an user edit a meal of other user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: await hash('123456', 8),
    });

    const user2 = await usersRepository.create({
      name: 'Wrong User',
      email: 'wrongUser@email.com',
      password: await hash('123456', 8),
    });

    const meal = await mealsRepository.create({
      userId: user.id,
      name: 'title',
      description: 'description',
      date: new Date(),
      onDiet: false,
    });

    await expect(() =>
      sut.execute({
        mealId: meal.id,
        userId: user2.id,
        name: 'new Title',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able an user edit a meal that does not exist', async () => {
    await expect(() =>
      sut.execute({
        mealId: 'meal-01',
        userId: 'user-01',
        name: 'new Title',
      }),
    ).rejects.toBeInstanceOf(MealNotFoundError);
  });
});
