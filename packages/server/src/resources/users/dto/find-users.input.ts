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
  @Field(() => ID)
  id?: number;

  @IsOptional()
  @Length(1, 256)
  @IsEmail()
  @Field()
  email?: string;

  @IsOptional()
  @Length(1, 256)
  @Field()
  name?: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  image?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field({ nullable: true })
  updatedAt?: Date | null;
}
