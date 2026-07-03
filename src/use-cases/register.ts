import bcrypt from 'bcryptjs';
import type { User } from '../generated/prisma/client';
import type { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  profilePicUrl?: string | null;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    profilePicUrl,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      profilePicUrl: profilePicUrl ?? null,
    });

    return { user };
  }
}
