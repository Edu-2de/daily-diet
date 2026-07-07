import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import { makeDeleteMealUseCase } from '../../../use-cases/factories/make-delete-use-case';

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const deleteMealParamSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteMealParamSchema.parse(request.params);

  try {
    const userId = request.user.sub;
    const deleteMealUseCase = makeDeleteMealUseCase();
    await deleteMealUseCase.execute({
      userId,
      mealId: id,
    });

    return reply.status(200).send();
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(409).send({
        message: err.message,
      });
    }
    throw err;
  }
}
