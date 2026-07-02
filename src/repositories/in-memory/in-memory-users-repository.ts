import { randomUUID } from 'node:crypto';
import type { User } from '../../generated/prisma/client';
import type { UserCreateInput } from '../../generated/prisma/models';
import type { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  constructor() {}

  async register(data: UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      profilePicUrl: data.profilePicUrl ?? null,
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
