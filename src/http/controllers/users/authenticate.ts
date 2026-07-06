import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import makeAuthenticateUseCase from '../../../use-cases/factories/make-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = reply.jwtSign({ sub: user.id });

    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(409).send({
        message: err.message,
      });
    }
    throw err;
  }
}
