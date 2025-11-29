import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable('account', {
  /** Database ID (PK) */
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  /** User ID (FK) */
  userId: bigint({ mode: 'number' })
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  /** Account provider ID */
  providerId: varchar({ length: 32 }).notNull(),
  /** Account ID in provider */
  accountId: varchar({ length: 512 }).notNull(),
  /** Provider access token */
  accessToken: text(),
  /** Provider refresh token */
  refreshToken: text(),
  /** Provider access token expiration timestamp */
  accessTokenExpiresAt: timestamp(),
  /** Provider refresh token expiration timestamp */
  refreshTokenExpiresAt: timestamp(),
  /** Provider account access scopes */
  scope: text(),
  /** Provider ID token */
  idToken: text(),
  /** Account password (manual authentication) */
  password: text(),
  /** Creation timestamp */
  createdAt: timestamp().notNull().defaultNow(),
  /** Update timestamp */
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});
