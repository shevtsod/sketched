import { Injectable } from '@nestjs/common';
import { Tail } from 'rxjs';
import { DbService } from '../../common/db/db.service';
import { users } from '../../common/db/schema';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(
    ...args: Tail<Parameters<typeof this.dbService.create<typeof users>>>
  ) {
    return this.dbService.create(users, ...args);
  }

  findOne(
    ...args: Tail<Parameters<typeof this.dbService.findOne<typeof users>>>
  ) {
    return this.dbService.findOne(users, ...args);
  }

  findMany(
    ...args: Tail<Parameters<typeof this.dbService.findMany<typeof users>>>
  ) {
    return this.dbService.findMany(users, ...args);
  }

  findManyWithCount(
    ...args: Tail<
      Parameters<typeof this.dbService.findManyWithCount<typeof users>>
    >
  ) {
    return this.dbService.findManyWithCount(users, ...args);
  }

  update(
    ...args: Tail<Parameters<typeof this.dbService.update<typeof users>>>
  ) {
    return this.dbService.update<typeof users>(users, ...args);
  }

  delete(
    ...args: Tail<Parameters<typeof this.dbService.delete<typeof users>>>
  ) {
    return this.dbService.delete(users, ...args);
  }

  count(...args: Tail<Parameters<typeof this.dbService.count<typeof users>>>) {
    return this.dbService.count(users, ...args);
  }
}
