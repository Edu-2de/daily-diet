import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import { makeCreateMealUseCase } from '../../../use-cases/factories/make-create-meal-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    onDiet: z.boolean(),
  });

  const { name, description, date, onDiet } = createBodySchema.parse(
    request.body,
  );

  try {
    const userId = request.user.sub;
    const createMealsUseCase = makeCreateMealUseCase();
    const { meal } = await createMealsUseCase.execute({
      name,
      description,
      date,
      onDiet,
      userId,
    });

    return reply.status(201).send({
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
