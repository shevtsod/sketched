import { Field, ID, InputType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class FindUserInput {
  @IsInt()
  @IsPositive()
  @Field(() => ID)
  id: number;
}
