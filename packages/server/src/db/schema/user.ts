import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  /** Database ID (PK) */
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  /**  Email address */
  email: varchar({ length: 256 }).notNull().unique(),
  /** Display name */
  name: varchar({ length: 256 }).notNull(),
  /** Image URL */
  image: text(),
  /** Creation timestamp */
  createdAt: timestamp().notNull().defaultNow(),
  /** Update timestamp */
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});
