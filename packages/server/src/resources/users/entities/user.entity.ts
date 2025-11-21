import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'Unique database ID' })
  id: number;

  @Field(() => String, { description: 'Username' })
  username: string;
}
