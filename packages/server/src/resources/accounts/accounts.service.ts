import { Injectable } from '@nestjs/common';
import { Tail } from 'rxjs';
import { DbService } from '../../common/db/db.service';
import { accounts } from '../../common/db/schema';

@Injectable()
export class AccountsService {
  constructor(private readonly dbService: DbService) {}

  create(
    ...args: Tail<Parameters<typeof this.dbService.create<typeof accounts>>>
  ) {
    return this.dbService.create(accounts, ...args);
  }

  findOne(
    ...args: Tail<Parameters<typeof this.dbService.findOne<typeof accounts>>>
  ) {
    return this.dbService.findOne(accounts, ...args);
  }

  findMany(
    ...args: Tail<Parameters<typeof this.dbService.findMany<typeof accounts>>>
  ) {
    return this.dbService.findMany(accounts, ...args);
  }

  findManyWithCount(
    ...args: Tail<
      Parameters<typeof this.dbService.findManyWithCount<typeof accounts>>
    >
  ) {
    return this.dbService.findManyWithCount(accounts, ...args);
  }

  update(
    ...args: Tail<Parameters<typeof this.dbService.update<typeof accounts>>>
  ) {
    return this.dbService.update<typeof accounts>(accounts, ...args);
  }

  delete(
    ...args: Tail<Parameters<typeof this.dbService.delete<typeof accounts>>>
  ) {
    return this.dbService.delete(accounts, ...args);
  }

  count(
    ...args: Tail<Parameters<typeof this.dbService.count<typeof accounts>>>
  ) {
    return this.dbService.count(accounts, ...args);
  }
}
