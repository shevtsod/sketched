import { Field, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class User {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'Database ID (PK)' })
  id: number;

  @Length(1, 256)
  @Field({ description: 'Display name' })
  username: string;

  @Length(1, 256)
  @IsEmail()
  @Field({ description: 'Email address' })
  email: string;

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
}
