import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Tail } from 'rxjs';
import { DbService } from '../../common/db/db.service';
import { users } from '../../common/db/schema';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async create(...values: CreateUserInput[]): Promise<User[]> {
    const records = await this.dbService.create(users, values);
    return plainToInstance(User, records);
  }

  async findOne(
    ...args: Tail<Parameters<DbService['findOne']>>
  ): Promise<User | undefined> {
    const record = await this.dbService.findOne(users, ...args);
    return plainToInstance(User, record);
  }

  async findMany(
    ...args: Tail<Parameters<DbService['findMany']>>
  ): Promise<User[]> {
    const records = await this.dbService.findMany(users, ...args);
    return plainToInstance(User, records);
  }

  async findManyWithCount(
    ...args: Tail<Parameters<DbService['findManyWithCount']>>
  ): Promise<[User[], number]> {
    const [records, count] = await this.dbService.findManyWithCount(
      users,
      ...args,
    );
    return [plainToInstance(User, records), count];
  }

  async update(
    ...args: Tail<Parameters<DbService['update']>>
  ): Promise<User[]> {
    const records = await this.dbService.update<typeof users>(users, ...args);
    return plainToInstance(User, records);
  }

  async delete(
    ...args: Tail<Parameters<DbService['delete']>>
  ): Promise<User[]> {
    const records = await this.dbService.delete(users, ...args);
    return plainToInstance(User, records);
  }

  count(...args: Tail<Parameters<DbService['count']>>): Promise<number> {
    return this.dbService.count(users, ...args);
  }
}
