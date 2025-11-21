import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// https://orm.drizzle.team/docs/sql-schema-declaration
export const users = pgTable('users', {
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  username: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});
