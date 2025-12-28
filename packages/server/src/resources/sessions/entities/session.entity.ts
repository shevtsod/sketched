import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsIP,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

@ObjectType()
export class Session {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'Database ID (PK)' })
  id: number;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'User ID (FK)' })
  userId: number;

  @Exclude()
  @Length(1, 256)
  @Field({ nullable: true, description: 'Unique session token' })
  token: string;

  @IsDate()
  @Field(() => Date, { description: 'Session token expiry timestamp' })
  expiresAt: Date;

  @IsOptional()
  @Length(1, 64)
  @IsIP()
  @Field(() => String, { nullable: true, description: 'Device IP address' })
  ipAddress?: string | null;

  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'Device user agent information',
  })
  userAgent?: string | null;

  @IsDate()
  @Type(() => Date)
  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @Field(() => Date, { nullable: true, description: 'Update timestamp' })
  updatedAt?: Date | null;

  constructor(partial: Partial<Session>) {
    Object.assign(this, partial);
  }
}
