import { relations } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { account } from './account';

export const user = pgTable('user', {
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  email: varchar({ length: 256 }).notNull().unique(),
  name: varchar({ length: 256 }).notNull(),
  image: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
}));
