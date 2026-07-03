import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMealsRepository } from '../repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import type { MealsRepository } from '../repositories/meals-repository';
import type { UsersRepository } from '../repositories/users-repository';
import { FetchUserMealsUseCase } from './fetch-user-meals';

let usersRepository: UsersRepository;
let mealsRepository: MealsRepository;
let sut: FetchUserMealsUseCase;

describe('Fetch User Meals Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    sut = new FetchUserMealsUseCase(mealsRepository);
  });

  it('should be able to an user get your own meals', async () => {
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
    const meal2 = await mealsRepository.create({
      userId: user.id,
      name: 'title2',
      description: 'description2',
      date: new Date(),
      onDiet: false,
    });

    const { meals } = await sut.execute({
      userId: user.id,
    });

    expect(meals).toHaveLength(2);
    expect(meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'title',
        }),
        expect.objectContaining({
          name: 'title2',
        }),
      ]),
    );
  });
});
