import { ArgsType, Field, OmitType } from '@nestjs/graphql';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Account } from '../entities/account.entity';

@ArgsType()
export class UpdateAccountInput extends OmitType(
  Account,
  ['createdAt', 'updatedAt'],
  ArgsType,
) {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'Provider access token' })
  accessToken?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Provider refresh token',
  })
  refreshToken?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Provider account access scopes',
  })
  scope?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'Provider ID token' })
  idToken?: string | null;

  @IsOptional()
  @IsStrongPassword()
  @Field(() => String, {
    nullable: true,
    description: 'Account password (manual authentication)',
  })
  password?: string | null;
}
