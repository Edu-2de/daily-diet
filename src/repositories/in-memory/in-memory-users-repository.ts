import { randomUUID } from 'node:crypto';
import type { User } from '../../generated/prisma/client';
import type { UserCreateInput } from '../../generated/prisma/models';
import type { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  constructor() {}

  async register(data: UserCreateInput) {
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

  async findByEmail(email: string) {
    const userWithSameEmail = this.items.find((item) => item.email === email);
    if (!userWithSameEmail) {
      return;
    }
    return userWithSameEmail;
  }

  async findById(id: string) {
    const usersFound = this.items.find((item) => item.id === id);
    if (!usersFound) {
      return;
    }
    return usersFound;
  }
}
