import { compare } from 'bcryptjs';
import type { User } from '../generated/prisma/browser';
import type { UsersRepository } from '../repositories/users-repository';
import { InvalidPasswordError } from './errors/invalid-password-error';
import { UserNotFoundError } from './errors/user-not-found-error';

export interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}
export interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new InvalidPasswordError();
    }

    return { user };
  }
}
