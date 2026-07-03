import type { Meal } from '../generated/prisma/client';
import type { MealsRepository } from '../repositories/meals-repository';
import { MealNotFoundError } from './errors/meal-not-found';
import { NotAllowedError } from './errors/not-allowed-error';

interface FetchMealByIdUseCaseRequest {
  userId: string;
  mealId: string;
}
interface FetchMealByIdUseCaseResponse {
  meal: Meal;
}

export class FetchMealByIdUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    mealId,
    userId,
  }: FetchMealByIdUseCaseRequest): Promise<FetchMealByIdUseCaseResponse> {
    const meal = await this.mealsRepository.findById(mealId);
    if (!meal) throw new MealNotFoundError();

    if (meal.userId !== userId) throw new NotAllowedError();

    return { meal };
  }
}
