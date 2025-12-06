import { Injectable } from '@nestjs/common';
import { Tail } from 'rxjs';
import { DbService } from '../../common/db/db.service';
import { users } from '../../common/db/schema';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(...values: CreateUserInput[]): Promise<User[]> {
    return this.dbService.create<typeof users>(users, values);
  }

  findMany(...args: Tail<Parameters<DbService['findMany']>>): Promise<User[]> {
    return this.dbService.findMany<typeof users>(users, ...args);
  }

  findManyWithCount(
    ...args: Tail<Parameters<DbService['findManyWithCount']>>
  ): Promise<[User[], number]> {
    return this.dbService.findManyWithCount<typeof users>(users, ...args);
  }

  findOne(
    ...args: Tail<Parameters<DbService['findOne']>>
  ): Promise<User | undefined> {
    return this.dbService.findOne<typeof users>(users, ...args);
  }

  update(...args: Tail<Parameters<DbService['update']>>): Promise<User[]> {
    return this.dbService.update<typeof users>(users, ...args);
  }

  delete(...args: Tail<Parameters<DbService['delete']>>): Promise<User[]> {
    return this.dbService.delete<typeof users>(users, ...args);
  }
}
