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

  async save(meal: Meal) {
    const mealToUpdate = this.items.findIndex(
      (mealItem) => mealItem.id === meal.id,
    );

    if (mealToUpdate >= 0) {
      this.items[mealToUpdate] = meal;
    }

    return meal;
  }

  async findById(id: string) {
    const meal = this.items.find((meal) => meal.id === id);
    if (!meal) {
      return;
    }
    return meal;
  }

  async delete(id: string) {
    this.items = this.items.filter((meal) => {
      return meal.id !== id;
    });
  }

  async findManyByUserId(userId: string) {
    const meals = this.items.filter((meal) => meal.userId === userId);
    return meals;
  }
}
