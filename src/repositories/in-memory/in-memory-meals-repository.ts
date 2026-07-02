import { randomUUID } from 'node:crypto';
import type { Meal } from '../../generated/prisma/client';
import type { MealUncheckedCreateInput } from '../../generated/prisma/models';
import type { MealsRepository } from '../meals-repository';

export class InMemoryMealsRepository implements MealsRepository {
  public items: Meal[] = [];

  constructor() {}

  async create(data: MealUncheckedCreateInput) {
    const meal: Meal = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      date: new Date(data.date),
      onDiet: data.onDiet,
      userId: data.userId,
    };

    this.items.push(meal);

    return meal;
  }
}
