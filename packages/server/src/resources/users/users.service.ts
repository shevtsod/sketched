import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import { user } from '../../db/schema';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(...createUserInputs: CreateUserInput[]): Promise<User[]> {
    return this.dbService.db.insert(user).values(createUserInputs).returning();
  }

  findAll(): Promise<User[]> {
    return this.dbService.db.query.user.findMany();
  }

  findOne(id: number): Promise<User | undefined> {
    return this.dbService.db.query.user.findFirst({ where: eq(user.id, id) });
  }

  update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    return this.dbService.db
      .update(user)
      .set(updateUserInput)
      .where(eq(user.id, id))
      .returning()
      .then((res) => res[0]);
  }

  remove(...ids: number[]): Promise<User[]> {
    return this.dbService.db
      .delete(user)
      .where(inArray(user.id, ids))
      .returning();
  }
}
