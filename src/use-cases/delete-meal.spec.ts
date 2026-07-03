import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { DeleteMealUseCase } from './delete-meal';
import { NotAllowedError } from './errors/not-allowed-error';

let usersRepository: InMemoryUsersRepository;
let mealsRepository: InMemoryMealsRepository;
let sut: DeleteMealUseCase;

describe('Delete Meal Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    sut = new DeleteMealUseCase(mealsRepository);
  });

  it('should be able to an user delete your own meal', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: await hash('123456', 8),
    });

    const meal = await mealsRepository.create({
      name: 'name',
      description: 'description',
      date: new Date(),
      onDiet: false,
      userId: user.id,
    });

    await sut.execute({
      mealId: meal.id,
      userId: user.id,
    });

    expect(mealsRepository.items).toHaveLength(0);
  });

  it('should not be able to an user delete a meal of other user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: await hash('123456', 8),
    });

    const meal = await mealsRepository.create({
      name: 'name',
      description: 'description',
      date: new Date(),
      onDiet: false,
      userId: user.id,
    });

    await expect(() =>
      sut.execute({
        mealId: meal.id,
        userId: 'user-wrong',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
