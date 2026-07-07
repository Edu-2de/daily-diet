import type { Meal } from '../generated/prisma/client';
import type { MealsRepository } from '../repositories/meals-repository';
import { MealNotFoundError } from './errors/meal-not-found';
import { NotAllowedError } from './errors/not-allowed-error';

export interface EditeMealUseCaseRequest {
  userId: string;
  mealId: string;
  name?: string | undefined;
  description?: string | undefined;
  onDiet?: boolean | undefined;
  date?: Date | string | undefined;
}
export interface EditMealUseCaseResponse {
  meal: Meal;
}

export class EditMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
    mealId,
    name,
    description,
    onDiet,
    date,
  }: EditeMealUseCaseRequest): Promise<EditMealUseCaseResponse> {
    const meal = await this.mealsRepository.findById(mealId);
    if (!meal) {
      throw new MealNotFoundError();
    }

    if (meal.userId !== userId) {
      throw new NotAllowedError();
    }

    meal.name = name ?? meal.name;
    meal.description = description ?? meal.description;
    meal.onDiet = onDiet ?? meal.onDiet;

    if (date) {
      meal.date = new Date(date);
    }

    await this.mealsRepository.save(meal);

    return { meal };
  }
}
