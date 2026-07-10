import { PrismaMealsRepository } from '../../repositories/prisma/prisma-meals-repository';
import { GetUserMealsMetricsUseCase } from '../get-user-meals-metrics';

export function makeGetUserMealsUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const useCase = new GetUserMealsMetricsUseCase(mealsRepository);

  return useCase;
}
