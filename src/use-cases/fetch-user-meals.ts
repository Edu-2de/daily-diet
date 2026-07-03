import type { Meal } from '../generated/prisma/client';
import type { MealsRepository } from '../repositories/meals-repository';

interface FetchUsersMealsUsecaseRequest {
  userId: string;
}
interface FetchUsersMealsUsecaseResponse {
  meals: Meal[];
}

export class FetchUserMealsUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
  }: FetchUsersMealsUsecaseRequest): Promise<FetchUsersMealsUsecaseResponse> {
    const meals = await this.mealsRepository.findManyByUserId(userId);

    return { meals };
  }
}
