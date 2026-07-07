import { PrismaMealsRepository } from '../../repositories/prisma/prisma-meals-repository';
import { FetchUserMealsUseCase } from '../fetch-user-meals';

export function makeFetchUserMeals() {
  const mealsRepository = new PrismaMealsRepository();

  const useCase = new FetchUserMealsUseCase(mealsRepository);

  return useCase;
}
