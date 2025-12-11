import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';
import * as types from '../../../utils/types';
import { Account } from '../../accounts/entities/account.entity';

@ObjectType()
export class User {
  @IsInt()
  @IsPositive()
  @Field(() => ID, { description: 'Database ID (PK)' })
  id: number;

  @Length(1, 256)
  @IsEmail()
  @Field({ description: 'Email address' })
  email: string;

  @Length(1, 256)
  @Field({ description: 'Display name' })
  name: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true, description: 'Image URL' })
  image?: string | null;

  @IsDate()
  @Type(() => Date)
  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @Field(() => Date, { nullable: true, description: 'Update timestamp' })
  updatedAt: Date | null;

  @IsOptional()
  @IsArray()
  @Field(() => [Account], { description: "User's accounts" })
  accounts?: types.WrapperType<Account>;
}
