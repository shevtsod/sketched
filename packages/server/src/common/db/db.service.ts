import { Injectable } from '@nestjs/common';
import { InferSelectModel, Placeholder, SQL } from 'drizzle-orm';
import {
  PgColumn,
  PgInsertValue,
  PgTable,
  PgUpdateSetSource,
} from 'drizzle-orm/pg-core';
import { DrizzleService } from './drizzle.service';

/**
 * Provides access to the SQL database for querying
 *
 * @see {@link https://orm.drizzle.team/docs/overview}
 */
@Injectable()
export class DbService {
  constructor(private drizzle: DrizzleService) {}

  /**
   * Creates new records for the given schema
   *
   * @param schema schema to use
   * @param values values to create
   * @param tx optional transaction instance
   * @returns list of created records
   */
  create<T extends PgTable>(
    schema: T,
    values: PgInsertValue<T>[],
    tx = this.drizzle.db,
  ) {
    return tx.insert(schema).values(values).returning();
  }

  /**
   * Returns a list of records matching the given query options
   *
   * @param schema schema to use
   * @param options query options
   * @param tx optional transaction instance
   * @returns list of records
   */
  async findMany<T extends PgTable>(
    schema: T,
    options: {
      where?: SQL;
      orderBy?: (PgColumn | SQL | SQL.Aliased)[];
      limit?: number | Placeholder;
    } = {},
    tx = this.drizzle.db,
  ) {
    let query = tx
      .select()
      .from(schema as PgTable)
      .$dynamic();
    if (options.where) query = query.where(options.where);
    if (options.limit !== undefined) query = query.limit(options.limit);
    if (options.orderBy) query = query.orderBy(...options.orderBy);
    return (await query) as InferSelectModel<T>[];
  }

  /**
   * Returns a list of records matching the given query options and the total
   * count of records that match the query options without a limit
   *
   * @param schema schema to use
   * @param options query options
   * @returns [list of records, number of total records]
   */
  findManyWithCount<T extends PgTable>(
    schema: T,
    options?: {
      where?: SQL;
      orderBy?: (PgColumn | SQL | SQL.Aliased)[];
      limit?: number | Placeholder;
    },
  ): Promise<[InferSelectModel<T>[], number]> {
    return this.drizzle.db.transaction(async (tx) => {
      return [
        await this.findMany(schema, options, tx),
        await this.count(schema, options),
      ];
    });
  }

  /**
   * Returns the first record matching the given query options
   *
   * @param schema schema to use
   * @param options query options
   * @param tx optional transaction instance
   * @returns first record matching query options
   */
  async findOne<T extends PgTable>(
    schema: T,
    options?: {
      where?: SQL;
      orderBy?: (PgColumn | SQL | SQL.Aliased)[];
    },
    tx = this.drizzle.db,
  ) {
    let query = tx
      .select()
      .from(schema as PgTable)
      .limit(1)
      .$dynamic();
    if (options?.where) query = query.where(options.where);
    if (options?.orderBy) query = query.orderBy(...options.orderBy);
    const res = (await query) as InferSelectModel<T>[];
    return res[0];
  }

  /**
   * Updates records matching the given filter with the given values
   *
   * @param schema schema to use
   * @param where query filter
   * @param set values to set
   * @param tx optional transaction instance
   * @returns list of updated records
   */
  update<T extends PgTable>(
    schema: T,
    where: SQL,
    set: PgUpdateSetSource<T>,
    tx = this.drizzle.db,
  ) {
    return tx.update(schema).set(set).where(where).returning();
  }

  /**
   * Deletes records matching the given query filter
   *
   * @param schema schema to use
   * @param where query filter
   * @param tx optional transaction instance
   * @returns list of deleted records
   */
  delete<T extends PgTable>(schema: T, where: SQL, tx = this.drizzle.db) {
    return tx.delete(schema).where(where).returning();
  }

  /**
   * Counts the number of records matching the given query filter
   *
   * @param schema schema to use
   * @param options query filter
   * @param tx optional transaction instance
   * @returns number of records
   */
  count<T extends PgTable>(
    schema: T,
    options?: { where?: SQL },
    tx = this.drizzle.db,
  ) {
    return tx.$count(schema, options?.where);
  }
}
