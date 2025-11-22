import { relations } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable('account', {
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: bigint({ mode: 'number' })
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  providerId: varchar({ length: 32 }).notNull(),
  accountId: varchar({ length: 512 }).notNull(),
  accessToken: text(),
  refreshToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  idToken: text(),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
