import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { makeFetchUserMeals } from '../../../use-cases/factories/make-fetch-user-meals';

export async function fetchManyByUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub;
    const fetchManyByUserUseCase = makeFetchUserMeals();
    const { meals } = await fetchManyByUserUseCase.execute({
      userId,
    });

    return reply.status(200).send({
      meals,
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
