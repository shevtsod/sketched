import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Database ID' })
  id: number;

  @Field(() => String, { description: 'Display name' })
  name: string;

  @Field(() => String, { description: 'Email address' })
  email: string;

  @Field(() => String, { nullable: true, description: 'Image URL' })
  image: string | null;

  @Field(() => Date, { description: 'Creation timestamp' })
  createdAt: Date;

  @Field(() => Date, { description: 'Update timestamp' })
  updatedAt?: Date;
}
