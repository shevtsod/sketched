import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';

@InputType()
export class FindUsersInput {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => ID, { nullable: true })
  id?: number;

  @IsOptional()
  @Length(1, 256)
  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Length(1, 256)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
