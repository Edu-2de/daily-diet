import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';
import { makeRegisterUseCase } from '../../../use-cases/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    profilePicUrl: z.string().optional(),
  });

  const { name, email, password, profilePicUrl } = registerBodySchema.parse(
    request.body,
  );

  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({
      name,
      email,
      password,
      profilePicUrl: profilePicUrl ? profilePicUrl : null,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(409).send({
        message: err.message,
      });
    }
    throw err;
  }

  return reply.status(201).send();
}
