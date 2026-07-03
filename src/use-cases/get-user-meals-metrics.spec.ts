import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { GetUserMealsMetricsUseCase } from './get-user-meals-metrics';

let usersRepository: InMemoryUsersRepository;
let mealsRepository: InMemoryMealsRepository;
let sut: GetUserMealsMetricsUseCase;

describe('Get User Meals Metrics Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    sut = new GetUserMealsMetricsUseCase(mealsRepository);
  });

  it('should be able an user get your own meals metrics', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: await hash('123456', 8),
    });

    const meal = await mealsRepository.create({
      userId: user.id,
      name: 'title',
      description: 'description2',
      date: new Date(),
      onDiet: true,
    });
    const meal2 = await mealsRepository.create({
      userId: user.id,
      name: 'title2',
      description: 'description2',
      date: new Date(),
      onDiet: true,
    });
    const meal3 = await mealsRepository.create({
      userId: user.id,
      name: 'title3',
      description: 'description3',
      date: new Date(),
      onDiet: false,
    });

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result).toEqual(
      expect.objectContaining({
        totalMeals: 3,
        mealsOnDiet: 2,
        mealOutDiet: 1,
        bestSequence: 2,
      }),
    );
  });
});
