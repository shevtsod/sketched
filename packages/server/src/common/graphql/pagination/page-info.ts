import { Field, ObjectType } from '@nestjs/graphql';

/** Pagination metadata */
@ObjectType()
export class PageInfo {
  /** First cursor */
  @Field(() => String, { nullable: true })
  startCursor: string | null;

  /** Last cursor */
  @Field(() => String, { nullable: true })
  endCursor: string | null;

  /** True if a previous page exists */
  @Field()
  hasPreviousPage: boolean;

  /** True if a next page exists */
  @Field()
  hasNextPage: boolean;
}
