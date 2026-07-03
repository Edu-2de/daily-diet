import type { Meal } from '../generated/prisma/client';
import type { MealsRepository } from '../repositories/meals-repository';
import type { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';

export interface CreateMealUseCaseRequest {
  name: string;
  description: string;
  date: string | Date;
  onDiet: boolean;
  userId: string;
}

export interface CreateMealUseCaseResponse {
  meal: Meal;
}

export class CreateMealUseCase {
  constructor(
    private mealRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    description,
    date,
    onDiet,
    userId,
  }: CreateMealUseCaseRequest): Promise<CreateMealUseCaseResponse> {
    const foundUser = await this.usersRepository.findById(userId);
    if (!foundUser) {
      throw new UserNotFoundError();
    }

    const meal = await this.mealRepository.create({
      name,
      description,
      date: new Date(date),
      onDiet,
      userId,
    });

    return { meal };
  }
}
