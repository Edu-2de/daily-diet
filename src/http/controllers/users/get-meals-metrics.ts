import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { makeGetUserMealsUseCase } from '../../../use-cases/factories/make-get-user-meals-use-case';

export async function getMealsMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub;
    const getMealsUseCase = makeGetUserMealsUseCase();

    const { bestSequence, mealOutDiet, mealsOnDiet, totalMeals } =
      await getMealsUseCase.execute({
        userId,
      });

    return reply.status(200).send({
      bestSequence,
      mealOutDiet,
      mealsOnDiet,
      totalMeals,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      reply.status(409).send({
        message: err.message,
      });
    }
    throw err;
  }
}
