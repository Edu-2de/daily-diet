import type { User } from '../generated/prisma/client';
import type { UsersRepository } from '../repositories/users-repository';

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
      throw new Error('Email already exists');
    }

    const user = await this.usersRepository.register({
      name,
      email,
      password,
      profilePicUrl: profilePicUrl ?? null,
    });

    return { user };
  }
}
