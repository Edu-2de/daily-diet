import { PrismaMealsRepository } from '../../repositories/prisma/prisma-meals-repository';
import { FetchMealByIdUseCase } from '../fetch-meal-by-id';

export function makeFetchMealByIdUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const useCase = new FetchMealByIdUseCase(mealsRepository);

  return useCase;
}
