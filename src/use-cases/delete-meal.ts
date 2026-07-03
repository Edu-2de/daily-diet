import type { MealsRepository } from '../repositories/meals-repository';
import { MealNotFoundError } from './errors/meal-not-found';
import { NotAllowedError } from './errors/not-allowed-error';

interface DeleteMealUseCaseRequest {
  userId: string;
  mealId: string;
}

interface DeleteMealUseCaseResponse {}

export class DeleteMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
    mealId,
  }: DeleteMealUseCaseRequest): Promise<DeleteMealUseCaseResponse> {
    const meal = await this.mealsRepository.findById(mealId);
    if (!meal) throw new MealNotFoundError();

    if (meal.userId !== userId) throw new NotAllowedError();

    await this.mealsRepository.delete(mealId);

    return {};
  }
}
