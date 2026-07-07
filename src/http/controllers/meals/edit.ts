import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import { makeEditMealUseCase } from '../../../use-cases/factories/make-edit-meal-use-case';

export async function editMeal(request: FastifyRequest, reply: FastifyReply) {
  const editMealBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    onDiet: z.boolean().optional(),
  });

  const editMealParamsSchema = z.object({
    id: z.string(),
  });

  try {
    const { name, description, date, onDiet } = editMealBodySchema.parse(
      request.body,
    );
    const { id } = editMealParamsSchema.parse(request.params);

    const userId = request.user.sub;
    const editMealUseCase = makeEditMealUseCase();
    await editMealUseCase.execute({
      mealId: id,
      userId,
      name,
      date,
      description,
      onDiet,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(409).send({
        message: err.message,
      });
    }

    throw err;
  }
}
