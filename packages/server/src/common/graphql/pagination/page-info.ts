import { Field, ObjectType } from '@nestjs/graphql';

/** Pagination metadata */
@ObjectType()
export class PageInfo {
  /** First cursor */
  @Field({ nullable: true })
  startCursor?: string;

  /** Last cursor */
  @Field({ nullable: true })
  endCursor?: string;

  /** True if a previous page exists */
  @Field()
  hasPreviousPage: boolean;

  /** True if a next page exists */
  @Field()
  hasNextPage: boolean;
}
