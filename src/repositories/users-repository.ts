import type { User } from '../generated/prisma/client';
import type { UserCreateInput } from '../generated/prisma/models';

export interface UsersRepository {
  register(data: UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
