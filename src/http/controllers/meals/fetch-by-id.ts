import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import { makeFetchMealByIdUseCase } from '../../../use-cases/factories/make-fetch-meal-by-id-use-case';

export async function fetchMealById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchMealByIdParamSchema = z.object({
    id: z.string(),
  });

  const { id } = fetchMealByIdParamSchema.parse(request.params);

  try {
    const userId = request.user.sub;
    const fetchMealByIdUseCase = makeFetchMealByIdUseCase();
    const { meal } = await fetchMealByIdUseCase.execute({
      userId,
      mealId: id,
    });

    return reply.status(200).send({
      meal,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(409).send({
        message: err.message,
      });
    }

    throw err;
  }
}
