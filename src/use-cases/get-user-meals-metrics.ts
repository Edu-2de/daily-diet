import type { MealsRepository } from '../repositories/meals-repository';

interface GetUserMealsMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMealsMetricsUseCaseResponse {
  totalMeals: number;
  mealsOnDiet: number;
  mealOutDiet: number;
  bestSequence: number;
}

export class GetUserMealsMetricsUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
  }: GetUserMealsMetricsUseCaseRequest): Promise<GetUserMealsMetricsUseCaseResponse> {
    const meals = await this.mealsRepository.findManyByUserId(userId);

    const totalMeals = meals.length;
    const mealsOnDiet = meals.filter((meal) => meal.onDiet).length;
    const mealOutDiet = meals.filter((meal) => !meal.onDiet).length;

    let bestSequence = 0;
    let currentSequence = 0;

    for (const meal of meals) {
      if (meal.onDiet) {
        currentSequence += 1;
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence;
        }
      } else {
        currentSequence = 0;
      }
    }

    return {
      totalMeals,
      mealsOnDiet,
      mealOutDiet,
      bestSequence,
    };
  }
}
