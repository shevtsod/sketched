import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Provider } from './provider.enum';

@ObjectType()
export class Account {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'Database ID (PK)' })
  id: number;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'User ID (FK)' })
  userId: number;

  @Length(1, 256)
  @IsEnum(Provider)
  @Field(() => String, { description: 'Account provider ID' })
  providerId: string;

  @Length(1, 256)
  @Field({ description: 'Account ID in provider' })
  accountId: string;

  @Exclude()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'Provider access token' })
  accessToken?: string | null;

  @Exclude()
  @IsOptional()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Provider refresh token',
  })
  refreshToken?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field(() => Date, {
    nullable: true,
    description: 'Provider access token expiration timestamp',
  })
  accessTokenExpiresAt?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field(() => Date, {
    nullable: true,
    description: 'Provider refresh token expiration timestamp',
  })
  refreshTokenExpiresAt?: Date | null;

  @Exclude()
  @IsOptional()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Provider account access scopes',
  })
  scope?: string | null;

  @Exclude()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'Provider ID token' })
  idToken?: string | null;

  @Exclude()
  @IsOptional()
  @IsStrongPassword()
  @Field(() => String, {
    nullable: true,
    description: 'Account password (manual authentication)',
  })
  password?: string | null;

  @IsDate()
  @Type(() => Date)
  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @Field(() => Date, { nullable: true, description: 'Update timestamp' })
  updatedAt?: Date | null;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
