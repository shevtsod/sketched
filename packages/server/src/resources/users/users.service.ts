import { Injectable } from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import {
  DbColumn,
  DbInsertValue,
  DbService,
  DbUpdateSetSource,
} from '../../db/db.service';
import { users } from '../../db/schema';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  idColumn(id: number): DbColumn {
    return users.id;
  }

  create(...values: DbInsertValue<typeof users>[]): Promise<User[]> {
    return this.dbService.db.insert(users).values(values).returning();
  }

  findMany({
    where,
    orderBy,
    limit,
  }: {
    where?: SQL;
    orderBy?: (DbColumn | SQL | SQL.Aliased)[];
    limit?: number;
  } = {}): Promise<[User[], number]> {
    return this.dbService.db.transaction(async (tx) => {
      const query = tx.select().from(users).where(where);
      if (limit !== undefined) query.limit(limit);
      if (orderBy !== undefined) query.orderBy(...orderBy);
      return [await query, await tx.$count(users, where)];
    });
  }

  findOne({
    where,
    orderBy,
  }: {
    where?: SQL;
    orderBy?: (DbColumn | SQL | SQL.Aliased)[];
  } = {}): Promise<User | undefined> {
    const query = this.dbService.db.select().from(users).where(where).limit(1);
    if (orderBy !== undefined) query.orderBy(...orderBy);
    return query.then((res) => res[0]);
  }

  update({
    set,
    where,
  }: {
    set: DbUpdateSetSource<typeof users>;
    where: SQL;
  }): Promise<User[]> {
    return this.dbService.db.update(users).set(set).where(where).returning();
  }

  delete({ where }: { where: SQL }): Promise<User[]> {
    return this.dbService.db.delete(users).where(where).returning();
  }
}
