import type { Meal } from '../generated/prisma/client';
import type { MealUncheckedCreateInput } from '../generated/prisma/models';

export interface MealsRepository {
  create(data: MealUncheckedCreateInput): Promise<Meal>;
}
