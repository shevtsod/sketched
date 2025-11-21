import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import { users } from '../../db/schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(...createUserInputs: CreateUserInput[]): Promise<User[]> {
    return this.dbService.db.insert(users).values(createUserInputs).returning();
  }

  findAll(): Promise<User[]> {
    return this.dbService.db.query.users.findMany();
  }

  findOne(id: number): Promise<User | undefined> {
    return this.dbService.db.query.users.findFirst({ where: eq(users.id, id) });
  }

  update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    return this.dbService.db
      .update(users)
      .set(updateUserInput)
      .where(eq(users.id, id))
      .returning()
      .then((res) => res[0]);
  }

  remove(...ids: number[]): Promise<User[]> {
    return this.dbService.db
      .delete(users)
      .where(inArray(users.id, ids))
      .returning();
  }
}
