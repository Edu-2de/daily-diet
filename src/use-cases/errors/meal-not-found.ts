export class MealNotFoundError extends Error {
  constructor() {
    super('Meal Not Found');
  }
}
