import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export default function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthenticateUseCase(usersRepository);

  return useCase;
}
