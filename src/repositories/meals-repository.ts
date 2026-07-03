import type { Meal } from '../generated/prisma/client';
import type { MealUncheckedCreateInput } from '../generated/prisma/models';

export interface MealsRepository {
  create(data: MealUncheckedCreateInput): Promise<Meal>;
  save(meal: Meal): Promise<Meal>;
  findById(id: string): Promise<Meal | void>;
  delete(id: string): Promise<void>;
  findManyByUserId(userId: string): Promise<Meal[]>;
}
