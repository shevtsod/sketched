import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsInt()
  @IsPositive()
  @Field(() => ID, { description: 'Database ID (PK)' })
  id: number;
}
