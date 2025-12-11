import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import * as types from '../../../utils/types';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Account {
  @Field(() => ID, { description: 'Database ID (PK)' })
  id: number;

  @Field({ description: 'User ID (FK)' })
  userId: number;

  @Field({ description: 'Account provider ID' })
  providerId: string;

  @Field({ description: 'Account ID in provider' })
  accountId: string;

  @Exclude()
  @Field(() => String, { nullable: true, description: 'Provider access token' })
  accessToken: string | null;

  @Exclude()
  @Field(() => String, {
    nullable: true,
    description: 'Provider refresh token',
  })
  refreshToken: string | null;

  @Field(() => Date, {
    nullable: true,
    description: 'Provider access token expiration timestamp',
  })
  accessTokenExpiresAt: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: 'Provider refresh token expiration timestamp',
  })
  refreshTokenExpiresAt: Date | null;

  @Exclude()
  @Field(() => String, {
    nullable: true,
    description: 'Provider account access scopes',
  })
  scope: string | null;

  @Exclude()
  @Field(() => String, { nullable: true, description: 'Provider ID token' })
  idToken: string | null;

  @Exclude()
  @Field(() => String, {
    nullable: true,
    description: 'Account password (manual authentication)',
  })
  password: string | null;

  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @Field(() => Date, { nullable: true, description: 'Update timestamp' })
  updatedAt: Date | null;

  @Field(() => User, { description: 'User this account belongs to' })
  user?: types.WrapperType<User>;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
