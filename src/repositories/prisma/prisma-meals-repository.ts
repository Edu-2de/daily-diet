import type { Meal } from '../../generated/prisma/client';
import type { MealUncheckedCreateInput } from '../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import type { MealsRepository } from '../meals-repository';

export class PrismaMealsRepository implements MealsRepository {
  async create(data: MealUncheckedCreateInput): Promise<Meal> {
    const meal = await prisma.meal.create({ data });
    return meal;
  }
  async save(meal: Meal): Promise<Meal> {
    await prisma.meal.update({
      where: {
        id: meal.id,
      },
      data: meal,
    });

    return meal;
  }

  async findById(id: string): Promise<Meal | void> {
    const meal = await prisma.meal.findUnique({
      where: {
        id,
      },
    });
    if (!meal) return;
    return meal;
  }

  async delete(id: string): Promise<void> {
    await prisma.meal.delete({
      where: {
        id,
      },
    });
  }

  async findManyByUserId(userId: string): Promise<Meal[]> {
    const data = await prisma.meal.findMany({
      where: {
        userId,
      },
    });
    return data;
  }
}
