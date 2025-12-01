import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FindUsersInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
